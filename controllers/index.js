/*
 * GET home page.
 */
var db = require('../models');

exports.index = function(req, res){
  require('./tab').getBestTabs(function(topTabs) {
    require('./user').getFollowingTabs(req.session.user,function(tabs){
        res.render('index', {
        topTabs : topTabs,
      	layout: 'main',
      	title: 'ShareTab',
        tabs: tabs
      });
    });
  });
}; 
