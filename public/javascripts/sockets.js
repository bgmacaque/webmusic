var socket = io.connect('http://localhost');
var followButton = $('#button-follow');
socket.emit('user',{});
socket.on('followerAdded',function(data) {
  $(".followers ul").append(data.nickname);
});

followButton.click(function() {
  //get the current profil id
  var path = location.pathname;
  var id = path.split('/')[2];
  //send the id of the current user
  socket.emit('follow',{
    idUser:id,
    idFollower:1
  });
});