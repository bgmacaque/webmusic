//config all socket event
var db = require('../models/');
var user = require('../controllers/user');
var tab = require('../controllers/tab');
module.exports = function(sessionSockets) {
  //io configuration

  sessionSockets.on('connection',function(err,socket,session){
          console.log(session.pokemon);

    //user
    socket.on('follow',function(data) {
      //call the function follow in user module
      user.follow(socket,data);
    });
    //connection with a nickname and a password
    socket.on('connect',function(data){
      user.connect(socket,data);
    })

    //tab
    socket.on('postComment',function(data){
      tab.addComment(sessionSockets.getIo().sockets,data);
    });
  });


};

