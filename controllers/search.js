var db = require('../models');

exports.index = function(req,res) {
  if(!req.query.q)
    res.render('search',{
      title:'SEARCH',
     layout:'main'
    });
  else
    searchEngine(req,res);
};



var searchEngine = function(req,res) {
  //search the results foreach words
  var keywords = req.query.q.trim().split('+');
  for(var i in keywords) {
    search(keywords[i],function(results){
      if(results[0][0] || results[1][0]) {
        res.render('search',{
          title:'RESULTS',
          layout:'main',
          users:results[0],
          tabs:results[1],
          result:true
        });
      }
      else
        res.render('search',{
          title:'RESULTS',
          layout:'main',
          result:false
        });
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
    where : ['`nickname` LIKE ? OR `lastname` LIKE ? OR `firstname` LIKE ? ',
                '%'+user.nickname+'%',
                '%'+user.lastname+'%',
                '%'+user.firstname+'%'] 
  })
  .success(function(usersFound) {
      callback(usersFound);
  });
};


var searchTab = function(keyword,callback) {
  db.Tab.findAll({
    where : ['`name` LIKE ?',
              '%'+keyword+'%']
  })
  .success(function(tabsFound){
      callback(tabsFound)
  });
};