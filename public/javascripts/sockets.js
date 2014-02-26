var socket = io.connect('http://localhost');
var followButton = $('#button-follow');
socket.emit('user',{});
socket.on('followerAdded',function(data) {
  $(".followers ul").append("<li>"+data.nickname+"</li>");
});

followButton.click(function() {
  //get the current profil id
  var path = location.pathname;
  var id = path.split('/')[3].match('[0-9]*')[0];
  alert(id);
  //send the id of the current user
  socket.emit('follow',{
    idUser:id,
    idFollower:4
  });
});