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

exports.follow = function(io) {
  
}


