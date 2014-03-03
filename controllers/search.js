var db = require('../models');

exports.index = function(req,res) {
  res.render('search',{
    title:'SEARCH',
    layout:'main'
  });
};



exports.searchEngine = function(req,res) {
  //search the results foreach words
  var keywords = req.search.trim().split(' ');
  for(var keyword in keywords) {
    search(keyword,function(results){
      if(results[0])
        res.render('search',{
          layout:'main',
          title:'results',
          results:results
        })
      else
        res.send('null');
    });
  }
};

var search = function(keyword,callback) {
  //search the keyword
  var list = [];
  searchUser(keyword,function(users){
      if(users)
        list.push(users);
      searchTab(keyword,function(tabs){
        if(tabs)
          list.push(tabs);
        callback(list);
      });
  });
};

var searchUser = function(keyword,callback) {
  var user = {
    nickname: keyword,
    lastname: keyword,
    firstname: keyword
  };
  db.User.findAll({
    where : [' `nickname` = LIKE %?% OR `lastname` LIKE %?% OR `firstname` LIKE %?% ',
                user.nickname,
                user.lastname,
                user.firstname] 
  })
  .success(function(usersFound) {
      callback(usersFound);
  });
};


var searchTab = function(keyword,callback) {
  db.User.findAll({
    where : ['name = ?',
              keyword]
  })
  .success(function(tabsFound){
      callback(tabsFound)
  });
};