//config all socket event
var db = require('../models/');
var user = require('../controllers/user');
module.exports = function(io) {
  //io configuration



  //user
  io.sockets.on('connection',function(socket){
    socket.on('follow',function(data) {
      //call the function follow in user module
      user.follow(socket,data);
    });
    //connection with a nickname and a password
    socket.on('connect',function(data){
      user.connect(socket,data);
    })
  });
};

