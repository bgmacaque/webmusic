var db = require('../models');
/*
 * GET users listing.
 */

module.exports = function(io) {
  console.log(io);
  //create the routes object
  routes = {};

  //fill the routes
  routes.list = function(req, res){
    db.User.findAll().success(function(users) {
      res.render('user',{
        users:users,
        layout:'main',
        title: 'BG'
      }); 
    });
  };
  routes.profil = function(req,res){
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

    //socket
    io.sockets.on('follow',function(data) {
      //get the id of the current user
      var idUser = req.params.id;
      //add follower
      db.User.find(idUser)
      .success(function(user){
        if(user!=null) {
          db.User.find(data.idFollower)
          .success(function(follower){
            //save follower
            follower.addUser(user);
          });
        }
      });
    });
  };

  
  routes.create = function(req,res){
    res.render('user',{
      layout:'main',
      create:true
    });
  };
  
  routes.save = function(req,res){
    console.log(req.body);
    var crypto = require('crypto');
    var salt = req.body.firstname+ 'babek' + res.lastname;
    var hash = crypto.createHmac('sha512',salt).update('PokemonBg').digest('hex');
  
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
      console.log(user);
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
  
  
  routes.update = function(req,res){
  
  };
  return routes;
}



