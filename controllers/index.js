/*
 * GET home page.
 */
var db = require('../models');

exports.index = function(req, res){
  req.session.pokemon = 'bg';
  require('./tab').getBestTabs(function(tabs) {
      res.render('index', {
      tabs : tabs,
    	layout: 'main',
    	title: 'ShareTab',
   	 	macaque:true,
    });
  });
}; 
