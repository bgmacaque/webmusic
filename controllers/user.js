var db = require('../models');
/*
 * GET users listing.
 */

exports.list = function(req, res) {
  db.User.findAll().success(function(users) {
    res.render('user',{
      users:users,
      layout:'main',
      title: 'BG'
    }); 
  });
};

/*
 * GET user profil
 */

exports.profil = function(req,res){
  //search the user which has the id in the request
  db.User.find(req.params.id)
  .success(function(user){
    if(user!=null)
      user.getFollowers()
      .success(function(followers){
        var isFollower = false;
        if(req.session.user) {
          //test if the session user is a follower
          followers.forEach(function(followerToTest) {
            if(followerToTest.id == req.session.user.id) {
              isFollower=true;
            }
          });
        }
        //count the favorites about the current user page
        var queryFavorites = "SELECT COUNT(*) AS COUNT FROM `TabsUsers` WHERE user_id = '"+ user.id +"'";

        db.sequelize.query(queryFavorites)
        .success(function(favoritesRow) {
          user.nbFavorites = favoritesRow[0]['COUNT'];
          //count the tabs of the current user
          var queryTabs = "SELECT COUNT(*) AS COUNT FROM `Tabs` WHERE user_id = '"+ user.id +"'";
          db.sequelize.query(queryTabs)
          .success(function(tabsRow){
            user.nbTabs = tabsRow[0]['COUNT'];
            var queryStars = "SELECT AVG(note) AS AVG FROM `Tabs` GROUP BY user_id HAVING user_id  = '"+ user.id+"'";
            db.sequelize.query(queryStars)
            .success(function(starsRow){
              user.nbStars = (starsRow[0]) ? starsRow[0]['AVG'] : 0; 
              //trunc the nbStars 
              user.nbStars = user.nbStars.toFixed(1);
              user.nbStars
                res.render('user',{
                  layout:'main',
                  isFollower: isFollower,
                  followers:followers,
                  user: user,
                  userCreate: false
                });              
            });
          });
        });
      });
      else
        res.send('404');
  })
  .error(function(error){
    res.send('404');
  });
};

/*
 * GET create user
 */

exports.create = function(req,res){
  res.render('user',{
    layout:'main',
    create:true
  });
};


exports.uploadImg = function(req,res) {
  var fs = require('fs');
  //write the image
  if (req.files.image && (req.files.image.type === 'image/png' || req.files.image.type === 'image/jpeg')) {
    //get the type of the image
    var extension = req.files.image.type.split('/')[1];
    var name = req.files.image.name;
    var newFile = "./public/images/profiles/"+req.session.user.id+"."+extension;
    fs.rename("./"+req.files.image.path,newFile,function(err){
      if(!err) {
        //save the image
        db.User.find(req.session.user.id)
        .success(function(user){
          user.image = '/images/profiles/'+req.session.user.id+"."+extension;
          user.save()
          .success(function(){
            console.log('OK');
            res.redirect('/');
          });
        });
      } else {
        console.log(err);
        res.render('500',{
          error:err
        });
      }

    });
  } else {
      res.redirect('/');
  }
}


function saveUpdate(req,res) {
  //update information about the current user
  if(req.session.user)
    db.User.find(req.session.user)
    .success(function(user){
      if(user) {
        //update the user
        user.email = req.body.email;
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.description = req.body.description;
        user.birthday = req.body.birthday;
        //check the password before updating
        require('./authenticate').check(user.nickname,req.body.password,function(err,user) {
          if(err) {
            res.render('500',{
              error:'error update form',
              layout:'main'
            });
          } 
          else
            user.save()
            .success(function(user){
              res.render('update-success',{
                layout:'main'
              });
            }); 
        });
      } else {
          res.render('500',{
            error:'error update form',
            layout:'main'
          }); 
      }
    });
}


/*
 *  POST new user
 */
exports.save = function(req,res){
  if(req.body.update == true) {
    return saveUpdate(req,res);
  }

  var hash = require('./authenticate').toHash(req.body.nickname,req.body.password,req.body.firstname);
  //create a new user to save it
  var user = db.User.build({
    nickname: req.body.nickname,
    email: req.body.email,
    salt : hash.salt,
    password: hash.password,
    description : req.body.description,
    lastname : req.body.lastname,
    firstname : req.body.firstname,
    birthday : req.body.birthday
  });

  var checkTab = ['firstname','nickname','salt','password','email'];
  //check posted elements
  for(property in checkTab ) {
     if(!user[checkTab[property]])
        res.render('500',{
          error:'FORM ERROR'
        });
  }

  db.User.find({where:{'nickname':user.nickname}})
   .success(function(userFound){
    //if the user doesn't exist in the database
    if(!userFound) {
      //save the user in the database
      user.save()
        .success(function(){
          req.session.user = user;
          res.render('signin',{
            layout:'main',
            user: req.session.user
          });
        })
        .error(function(error){res.render('500',{
          error:'FORM ERROR'
        });
      });
    }
     else
      res.render('500', {
        error:"This user already exists!"
      });
   });
};


exports.update = function(req,res){
  if(req.session.user)
    res.render('user-update',{
      layout:'main',
      user:req.session.user
    });
  else
    res.send('404 NOT FOUND');
};



exports.login = function(req,res) {
  require('./authenticate').check(req.body.nickname,req.body.password,function(err,user) {
    if(err) {
      res.send('ERROR');
    }
    else {
      req.session.user = user;
      //redirect to the last page
      backURL=req.header('Referer') || '/';
      res.redirect(backURL);
    }
  });
}


//get the tabs of the current user
exports.getTabs = function(req,res) {
  if(!req.session.user)
    res.redirect('/');
  db.User.find(req.session.user.id)
  .success(function(user){
    if(user) {
      user.getTabs()
      .success(function(tabs){
        res.render('user-tabs',{
          layout:'main',
          tabs:tabs
        });
      }); 
    }
  });
}


exports.logout = function(req,res) {
  //delete the current user
  delete req.session.user;
  res.redirect('/');
}

//get recent tabs which are in the following list
var getFollowers = function(idUser,callback) {
  //create the query
  var query = 'SELECT * FROM `FollowerUsers`, `Users`, `Tabs` ';
  query += 'WHERE FollowerUsers.user_id = Users.id ';
  query += 'AND Tabs.user_id = Users.id ';
  query += 'AND FollowerUsers.followers_id = ' + idUser;
  //execute the query
  db.User.find(idUser)
  .success(function(user){
    if(user) {                    
     db.sequelize.query(query)
      .success(function(tabs){
        callback(tabs);
      }).error(function(error){
        console.log('ERROR '+error);
      });
    } else {
      callback(null);
    }
  });
};


exports.getFollowingTabs = function(user,callback) {
  if(user)
    getFollowers(user.id,callback);
  else
    callback(null);
};

//sockets 
exports.unfollow = function(socket,data) {
  //check the session
  if(!data.session.user)
    return;

  //get the user in the session
  var idFollower = data.session.user.id;
   //find the user who will be unfollowed
  db.User.find(data.idUser)
  .success(function(user){ 
    if(user)
      db.User.find(idFollower)
      .success(function(follower){
        user.removeFollower(follower);
        socket.emit('unfollowOk',follower);
      });
  });
};

exports.follow = function(socket,data) {
  //check the session
  if(!data.session.user)
    return;
  //get the user in the session
  var idFollower = data.session.user.id;
  //find the user who will be followed
  db.User.find(data.idUser)
  .success(function(user){
    if(user!=null) {
      //find the user which wants to follow
      db.User.find(idFollower)
      .success(function(follower){ 
        if(follower!=null){
          //check the following
          user.getFollowers()
          .success(function(followers){
            var followerExist = false;
            var i = 0;
            while(!followerExist && i < followers.length) {
              followerExist = (followers[i].id === follower.id);
              i++;
            }
            //add the follower if is not already exist
            if(!followerExist) {
              user.addFollower(follower)
              .success(function(){
                  socket.emit('followerAdded',follower);
              })
              .error(function(error){
                throw error;
              });
            }
          });
        };
      });
    };
  });
};





exports.connect = function(socket,data) {
  require('./authenticate').check(data.nickname,data.password,function(err,user) {
    if(err) {
      socket.emit('connection-error');
    }
    else {
      socket.emit('connected',user);
    }
  });
};
