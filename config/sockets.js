//config all socket event
var db = require('../models/');
var user = require('../controllers/user');
var tab = require('../controllers/tab');
module.exports = function(io) {
  //io configuration

  io.sockets.on('connection',function(socket){

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
      tab.addComment(io.sockets,data);
    });
  });


};

