var socket = io.connect('http://localhost');

//follow
var followButton = $('#button-follow');
socket.emit('user',{});
socket.on('followerAdded',function(data) {
  $(".followers ul").append("<li>"+data.nickname+"</li>");
});

followButton.click(function() {
  //get the current profil id
  var path = location.pathname;
  var id = path.split('/')[3].match('[0-9]*')[0];
  //send the id of the current user
  socket.emit('follow',{
    idUser:id,
    idFollower:1
  });
});



//connect
var connectForm = $('#form-connect');
connectForm.submit(function(e){
  e.preventDefault();
  socket.emit('connect',{
    nickname: $('#nickname').val(),
    password: $('#password').val()
  });
});