var socket = io.connect('http://localhost');
var followButton = $('#button-follow');
socket.emit('user',{});

followButton.click(function() {
  //get the current profil id
  var path = location.pathname;
  var id = path.split('/')[2];
  //send the id of the current user
  socket.emit('follow',{
    idUser:id,
    idFollower:2
  });
});

socket.on('followerAdded',function(data){
  //insert the latest follower

  //we have to compile the view with an updated context
  
});
