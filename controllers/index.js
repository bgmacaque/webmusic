/*
 * GET home page.
 */
var db = require('../models');

exports.index = function(req, res){
  req.session.pokemon = 'bg';
  db.User.findAll().success(function(users) {
      res.render('index', {
      users : users,
    	layout: 'main',
    	title: 'Express',
   	 	macaque:true,
    });
  });
}; 
