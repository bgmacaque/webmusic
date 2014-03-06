var db = require('../models');
exports.index = function(req,res){
  db.Tab.findAll({order: 'name'})
  .success(function(tabs){ 
    res.render('listing',{
      layout:'main',
      title:'Listing',
      tabs:tabs
    });
  });
};