var db = require('../models');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  db.User.findAll().success(function(users) {
    res.render('user',{
      users:users,
      layout:'main',
      title: 'BG'
    }); 
  });
};

exports.create = function(req,res){
	res.send("CREATION");
};

exports.profil = function(req,res){
  //search the user which has the id in the request
  db.User.find(req.params.id)
  .success(function(user){
    if(user!=null)
      res.render('user',{
        layout:'main',
        title: user.nickname,
        nickname: user.nickname,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        description: user.description
      });
    else
      res.send('404');
  })
  .error(function(error){
    res.send('404');
  });
};


exports.create = function(req,res){
  res.render('user-create',{
    layout:'main'
  });
};

exports.save = function(req,res){
  console.log(req.body);
  var crypto = require('crypto');
  var salt = req.body.firstname+ 'babek' + res.lastname;
  var hash = crypto.createHmac('sha512',salt).update('PokemonBg').digest('hex');
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
  user.save()
  .success(function(){res.send("SUCCESS");})
  .error(function(error){res.send(error);});
};