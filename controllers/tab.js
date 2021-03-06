var db = require('../models');

/*
 * GET tabs listing
 */

exports.list = function(req,res) {
  db.Tab.findAll()
  .success(function(tabs){
    res.render('tab',{
      tabs:tabs,
      layout:'main',
      title:'TABS'
    });
  });
};

exports.getBestTabs = function(callback) {
  //find 10 best tabs in database
  db.Tab.findAll({
    limit: 10,
    order: ' `note` DESC'
  }).success(function(tabs){
    if(tabs) {
      callback(tabs);
    }
  })
};

exports.profil = function(req,res) {
  var idTab = req.params.id;
  var query = 'SELECT * from Users, Comments ';
  query += 'WHERE Comments.tab_id = '+idTab;
  query += ' AND Users.id = Comments.user_id ';
  query += 'ORDER BY Comments.created_at DESC ';
  db.Tab.find(idTab)
  .success(function(tab){  
    if(tab)
      db.sequelize.query(query)
      .success(function(comments){
        var sum = 0;
        //calc the average of comment notes
        for (var i = 0; i < comments.length; i++) {
          sum += comments[i].note;
        };
        var average = (comments.length!=0) ? sum/comments.length : 0;
        tab.note = average.toFixed(2);
        //generate the vextab language
        var translatedText = translateToVexTab(tab.file);
        
        var queryAuthor = "SELECT * FROM Users WHERE id = '"+tab.user_id+"'";

        db.sequelize.query(queryAuthor)
        .success(function(authorRow){
          if(!authorRow)
            res.send('404');
          //check if the current user has this tab in his favorite list
          if(req.session.user) {
            var queryFavorite = "SELECT * FROM TabsUsers WHERE user_id = '"+req.session.user.id+"'";
            db.sequelize.query(queryFavorite)
            .success(function(favRow) {
              var isFavorite = false;
              if(favRow[0])
                isFavorite = true;
              //send the page
              res.render('tab',{
                layout:'main',
                comments:comments,
                tab:tab,
                tabText : translatedText,
                author:authorRow[0],
                isFavorite : isFavorite
              });          
            });
          } else { //if the session user is not defined
              res.render('tab',{
                layout:'main',
                comments:comments,
                tab:tab,
                tabText : translatedText,
                isFavorite:false,
                author:authorRow[0]
              });                 
          }
        }); //end queryAuthor
      }); //end find tab
    else
      res.send('404');
  })
  .error(function(error){
    console.log(error);
  });
};


function translateToVexTab(json) {
  //here the json file is in well format
  var textGenerated = 'options player=true ';
  //spaces in the properties name because of the json format
  var tabParsed = JSON.parse(json);
  var tempo = tabParsed[' tempo '];
  var positions = tabParsed[ ' emplacements '];
  textGenerated += ' tempo='+tempo.toString()+'\n';
  textGenerated += 'tabstave notation=false tablature=true \n';
  textGenerated += ' notes';
  var lines = [6,5,4,3,2,1];
  //generate the notes
  for(i in positions) {
    //i is the current display chord
    var chords = positions[i];

    textGenerated += ' (';
    //get the current note
    for(j in chords) {
      var note = chords[j];
      var number = note[' number ']; 
      var line = note[' line '];
      //convert line into the well format
      line = lines[line];

      //write the notes
      textGenerated += number.toString()+'/'+line.toString()+'.';      
    }
    //remove the latest dot
    textGenerated = textGenerated.substring(0, textGenerated.length - 1);
    textGenerated += ' ) ';
  }
  return textGenerated;
}

exports.create = function(req,res) {
  res.render('tab',{
    create:true,
    layout:'main',
    title:'IMPORT YOUR TAB'
  });
};


exports.download = function(req,res) {
  //get the tab which will be downloaded
  db.Tab.find(req.params.id)
  .success(function(tab) {
    var fs = require('fs');
    //write the new file which contains information about the tab which will be downloaded
    fs.writeFile('./public/tmp/tab/'+tab.name.trim()+'user_'+tab.user_id+'.tab',tab.file,function(err){
      if(!err) {
        //send the tab file
        res.download('./public/tmp/tab/'+tab.name.trim()+'user_'+tab.user_id+'.tab',tab.name.trim()+".tab");
      } else
        console.log(err);
    });
  });
}


exports.getAllFavorites = function(req,res) {
  //check the session
  if(!req.session.user)
    res.redirect('/');
  
  var idTab = req.params.id;
  var query = 'SELECT * FROM TabsUsers, Tabs WHERE TabsUsers.user_id = \''+req.session.user.id + '\' AND TabsUsers.tab_id = Tabs.id ORDER BY Tabs.name';
  db.sequelize.query(query)
  .success(function(TabRows){
    res.render('favorites',{
      layout:'main',
      tabs:TabRows
    });
  })
  .error(function(error){
    console.log(error);
  })
}


//sockets

exports.upload = function(socket,data) {

  if( data.json && data.session.user ) {
    //parse the file in JSON file
    var tabParsed;
    try {
     tabParsed = JSON.parse(data.json);

    } catch(e) {
      socket.emit('tabUploadError',e);  
      return;    
    } 

    var nameParsed = tabParsed[' name '];
    //save and check the tab uploaded
    var tab = {
      name: nameParsed,
      file: data.json,
      note: 0,
      user_id: data.session.user.id
    };
    db.Tab.create(tab)
    .success(function(tabAdded){
      socket.emit('tabAdded',tabAdded);
    })
    .error(function(err){
      console.log(err);
      socket.emit('tabUploadError',err);
    });
  }  else {
      socket.emit('tabUploadError',{});
  }
}



exports.addFavorite = function(socket,data) {
  //check the session
  if(!data.session.user)
    return;
  //add the tab to the favorite list
  db.User.find(data.session.user.id)
  .success(function(user){
    if(user) {
      var query = "INSERT INTO TabsUsers(`tab_id`,`user_id`) VALUES ( '"+data.id+"','"+user.id+"')";
      db.sequelize.query(query)
      .success(function() {
        socket.emit('favoriteAdded',{

        });
      })
      .error(function(error){
        rmFavorite(socket,data);
      });
    }
  });
}


function rmFavorite(socket,data) {
  //check the session
  if(!data.session.user)
    return;
  //delete the tab from the favorite list
  db.User.find(data.session.user.id)
  .success(function(user){
    if(user) {
      var query = "DELETE FROM TabsUsers WHERE tab_id = '"+data.id+"' AND user_id = '"+user.id+"'";
      db.sequelize.query(query)
      .success(function() {
        socket.emit('favoriteDeleted',{

        });
      })
      .error(function(error){
        console.log(error);
      });
    }
  });
}






exports.addComment = function(sockets,data) {
  //check the session
  if(!data.session.user)
    return;

  //check the user
  db.User.find(data.session.user.id)
  .success(function(user){
    if(user) {
      //check the tab
      db.Tab.find(data.tabId)
      .success(function(tab){
        //check the body
        if(data.body && tab) {
          //create the comment which will be added
          var comment = {
            user_id: user.id,
            body: data.body,
            note: (data.note) ? data.note : 0,
            tab_id: tab.id
          };
          db.Comment.create(comment)
          .success(function(commentAdded){
            //update the tab note
            db.Tab.find(tab.id)
            .success(function(tab){
              //get the average of the notes
              var queryAvg = "SELECT AVG(note) AS AVG FROM Comments WHERE tab_id ='"+tab.id+"'";
              db.sequelize.query(queryAvg)
              .success(function(averageRow){
                var avg = averageRow[0]['AVG'];
                tab.note = avg;
                tab.save()
                .success(function(){
                   sockets.emit('commentAdded',{
                    author: data.session.user.nickname,
                    note: commentAdded.note,
                    body: commentAdded.body
                  });                 
                });
              });
            }) 
          });
        } else {
          res.send('500',{
            error:'FORM ERROR',
            layout:"main"
          });
        }
      });
    } else {
      res.send('500',{
        error:'UNKNOWN AUTHOR',
        layout:"main"
      });
    }
  });
};