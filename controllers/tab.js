var db = require('../models');

/*
 * GET tabs listing
 */

exports.list = function(req,res) {
  db.Tab.findAll()
  .success(function(tabs){
    res.render('tab',{
      tabs:tabs,
      layout:'main',
      title:'TABS'
    });
  });
};


exports.profil = function(req,res) {
  db.Tab.find(req.params.id) 
  .success(function(tab){
    if(tab!=null)
      tab.getComments()
      .success(function(comments){
        res.render('tab',{
          layout:'main',
          comments:comments,
          tab:tab
        });
      });
  });
};

exports.create = function(req,res) {
  res.render('tab',{
    create:true,
    layout:'main',
    title:'IMPORT YOUR TAB'
  });
};



//sockets

exports.addComment = function(sockets,data) {
  //check the user
  db.User.find({where : {'nickname' : data.author} })
  .success(function(user){
    if(user) {
      //check the tab
      db.Tab.find(data.tabId)
      .success(function(tab){
        //check the body
        console.log(tab);
        if(data.body && tab) {
          //create the comment which will be added
          var comment = {
            user_id: user.id,
            body: data.body,
            note: (data.note) ? data.note : 0,
            tab_id: tab.id
          };
          db.Comment.create(comment)
          .success(function(commentAdded){
            sockets.emit('commentAdded',{
              comment : commentAdded,
              author : data.author
            });
          });
        }
      });
    }
  });
};