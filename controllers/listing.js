var db = require('../models');
exports.index = function(req,res){
  db.Tab.findAll({order: 'name'})
  .success(function(tabs){ 
    var orderTabs = {};
    var keys = [];
    var letter = '';
    for(i in tabs) {
      if(letter == tabs[i].name[0])
        orderTabs[letter.toUpperCase()].push(tabs[i]);
      else {
        letter = tabs[i].name[0];
        orderTabs[letter.toUpperCase()] = [];
        keys.push(letter.toUpperCase());
      }
    }
    res.render('listing',{
      layout:'main',
      title:'Listing',
      orderTabs:orderTabs
    });
  });
};