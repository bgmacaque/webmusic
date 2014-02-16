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