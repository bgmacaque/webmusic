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

exports.addComment = function(socket,data) {
  data.author
  data.body 
  data.bandId
  //check the user
  db.User.find({where : {'nickname' : data.author} })
  .success(function(user){
    if(user) {
      //check the tab
      db.Band.find(tadId)
      .success(function(tab){
        //check the body
        if(data.body && tab) {
          //make the comment to add
          var comment = db.Comment.build({
            author: data.author,
            body: data.body
          });
          tab.addComment(comment)
          .success(function(){
            socket.emit('commentAdded',comment);
          });
        }
      });
    }
  });
};