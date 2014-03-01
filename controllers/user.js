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
        res.render('user',{
          layout:'main',
          followers:followers,
          id:user.id,
          title: user.nickname,
          nickname: user.nickname,
          firstname: user.firstname,
          lastname: user.lastname,
          birthday: user.birthday,
          description: user.description,
          userCreate: false
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

/*
 *  POST new user
 */

exports.save = function(req,res){
  var crypto = require('crypto');
  var salt = req.body.firstname+ 'babek' + req.body.lastname;
  var hash = crypto.createHmac('sha512',salt).update(req.body.password).digest('hex');

  //create a new user to save it
  var user = db.User.build({
    nickname: req.body.nickname,
    email: req.body.email,
    salt : salt,
    password: hash,
    description : req.body.description,
    lastname : req.body.lastname,
    firstname : req.body.firstname,
    birthday : req.body.birthday
  });

   db.User.find({where:{'nickname':user.nickname}})
   .success(function(userFound){
    //if the user doesn't exist in the database
    if(userFound==null) {
      //save the user in the database
      user.save()
        .success(function(){res.send("SUCCESS");})
        .error(function(error){res.send(error);});
     }
     else
      res.send("USER ALREADY EXISTS !");
   });
};


exports.update = function(req,res){

};


//sockets 

exports.follow = function(socket,data) {
  //find the user who will be followed
  db.User.find(data.idUser)
  .success(function(user){
    if(user!=null) {
      console.log(user);
      //find the user which wants to follow
      db.User.find(data.idFollower)
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
  var crypto = require('crypto');
  var query = 'nickname = \''+data.nickname+'\'';
  db.User.find({where: query})
  .success(function(user) {
    //if the user is found
    if(user) {
      console.log(user);
      //check the password
      var salt = user.salt;
      var hash = crypto.createHmac('sha512',salt).update(data.password).digest('hex'); 

      var pass = user.password;
      if(pass === hash) {
        console.log("CONNECTED");
        socket.emit('connected',user);
      }
      else {
        socket.emit('connection-error');
      }
    }
  })
  .error(function(error){
    console.log(error);
  });
};


