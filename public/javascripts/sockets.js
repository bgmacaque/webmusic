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
    idFollower:2
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
    note: $('#post-note').val(),
    tabId: tabId
  });
});


socket.on('commentAdded',function(data){
  //update the current tab note
  var note = parseFloat(data.note);
  var current_note = parseFloat($('#tab-note').text())
  var count = $('.comment').size();
  var result = ( note + current_note*count ) / (count + 1) ;
  $('#tab-note').html(result);
  $('.comments').prepend("<li>"+data.body+" -->"+data.author+"=>"+data.note+"</li>")
});