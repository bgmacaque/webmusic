//config all socket event
var db = require('../models/');
module.exports = function(io) {
  //user
  io.sockets.on('connection',function(socket){
    socket.on('follow',function(data){
      //find the user who will be followed
      db.User.find(data.idUser)
      .success(function(user){
        if(user!=null) {
          //find the user which wants to follow
          db.User.find(data.idFollower)
          .success(function(follower){
            if(follower!=null){
              user.addFollower(follower);
              //send the new list of followers
              user.getFollowers()
              .success(function(followers){
                socket.emit('followerAdded',followers);
              });
            }
          });
        }
        else
          socket.emit("ERROR");
      });
    });
  }); 
};
