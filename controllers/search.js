var db = require('../models');

exports.index = function(req,res) {
  res.render('search',{
    title:'SEARCH',
    layout:'main'
  });
}