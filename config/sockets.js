//config all socket event
var db = require('../models/');
var user = require('../controllers/user');
var tab = require('../controllers/tab');
module.exports = function(sessionSockets) {
  //io configuration
  sessionSockets.on('connection',function(err,socket,session){
    //user
    socket.on('follow',function(data) {
      //call the function follow in user module
      data.session = session;
      user.follow(socket,data);
    });

    socket.on('unfollow',function(data) {
      //call the function follow in user module
      data.session = session;
      user.unfollow(socket,data);
    });
    //connection with a nickname and a password
    socket.on('connect',function(data){
      user.connect(socket,data);
    })

    //tab
    socket.on('postComment',function(data){
      data.session = session;
      tab.addComment(sessionSockets.io().sockets,data);
    });

    //add new tab with upload
    socket.on('tabSent',function(data){
      data.session = session;
      tab.upload(socket,data);
    });

    //add favorite
    socket.on('addFavorite',function(data){
      data.session =session;
      tab.addFavorite(socket,data);
    });
    
  });

};

