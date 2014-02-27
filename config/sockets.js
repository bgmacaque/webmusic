//config all socket event
var db = require('../models/');
module.exports = function(io,hbs) {
  //user
  io.sockets.on('connection',function(socket){
    socket.on('follow',function(data){
      //find the user who will be followed
      db.User.find(data.idUser)
      .success(function(user){
        if(user!=null) {
          console.log(user);
          //find the user which wants to follow
          db.User.find(data.idFollower)
          .success(function(follower){
            if(follower!=null){
              //check the following
              user.getFollowers()
              .success(function(followers){
                var followerExist = false;
                var i = 0;
                while(!followerExist && i < followers.length) {
                  followerExist = (followers[i].id === follower.id);
                  i++;
                }

                //add the follower if is not already exist
                if(!followerExist) {
                  user.addFollower(follower)
                  .success(function(){
                      socket.emit('followerAdded',follower);
                  })
                  .error(function(error){
                    throw error;
                  });
                }
              });
            };
          });
        };
      });
    }); 
  });
};

