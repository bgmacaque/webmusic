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
        res.render('tab',{
          layout:'main',
          comments:comments,
          tab:tab,
          tabText : translatedText
        });
      });
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
  var tabParsed = JSON.parse(json);
  var positions = tabParsed.emplacements;
  textGenerated += ' tempo='+tabParsed.tempo.toString()+'\n';
  textGenerated += 'tabstave notation=true tablature=false \n';
  textGenerated += ' notes';
  //generate the notes
  for(i in tabParsed.chords) {
    textGenerated += ' (';
    //get the current note
    var notes = tabParsed.chords[i].notes;
    for(j in notes) {
      var note = notes[j];
      var number = require('./calc').calcNumber(note,i,j,positions);
      var line = require('./calc').calcLine(note,i,j,positions);

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
    fs.writeFile('./public/tmp/tab/'+tab.name+'user_'+tab.user_id+'.tab',tab.file,function(err){
      if(!err) {
        //send the tab file
        res.download('./public/tmp/tab/'+tab.name+'user_'+tab.user_id+'.tab',tab.name);
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

  if( data.json && data.session.user.id ) {
    //parse the file in JSON file
    var tabParsed;
    try {
    var tabParsed = JSON.parse(data.json);
    } catch(e) {
      console.log(e);
      socket.emit('tabUploadError',e);  
      return;    
    } 

    var nameParsed = tabParsed.name;
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
      socket.emit('tabUploadError',err);
    });
  }  else {
      socket.emit('tabUploadError',e);
  }
}



exports.addFavorite = function(socket,data) {
  //check the session
  if(!data.session.user)
    return;

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
            error:'FORM ERROR'
          });
        }
      });
    } else {
      res.send('500',{
        error:'UNKNOWN AUTHOR'
      });
    }
  });
};