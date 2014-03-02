var socket = io.connect('http://127.0.0.1:3000');

// //follow
var followButton = $('#button-follow');
socket.emit('user',{});
socket.on('followerAdded',function(data) {
  $(".followers ul").append("<li>"+data.nickname+"</li>");
});

followButton.on('click',function(e) {
  //get the current profil id
  e.preventDefault();
  var path = location.pathname;
  var id = path.split('/')[3].match('[0-9]*')[0];
  //send the id of the current user
  socket.emit('follow',{
    idUser:id,
    idFollower:6
  });
});

var postComment = $('#submit-comment');


postComment.on('click',function(e){
  e.preventDefault();
  var url = location.pathname;
  var tabId = url.split('/')[3].match('[0-9]*')[0];
  socket.emit('postComment',{
    body: $('#post-body').val(),
    author: $('#post-author').val(),
    tabId: tabId
  });
});


socket.on('commentAdded',function(data){
  $('.comments').prepend("<li>"+data.comment.body+" -->"+data.author+"</li>")
});