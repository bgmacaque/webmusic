(function() {
  var socket = io.connect('http://127.0.0.1:3000');
   var follow = function(e) {
    //get the current profil id
    e.preventDefault();
    var path = location.pathname;
    var id = path.split('/')[3].match('[0-9]*')[0];
    //send the id of the current user
    socket.emit('follow',{
      idUser:id,
    });
  };
  
  
  var unfollow = function(e) {
    //get the current profil id
    e.preventDefault();
    var path = location.pathname;
    var id = path.split('/')[3].match('[0-9]*')[0];
    //send the id of the current user
    socket.emit('unfollow',{
      idUser:id,
    });
  };

  // //follow
  var followButton = $('#button-follow');
  var unfollowButton = $('#button-unfollow');
  followButton.on('click',follow);
  unfollowButton.on('click',unfollow);

  socket.on('followerAdded',function(data) {
    $(".followers ul").hide().append("<li>"+data.nickname+"</li>").fadeIn();
    $('#button-follow').replaceWith('<a id="button-unfollow" href="#unfollow">Unfollow</a>');
    unfollowButton = $('#button-unfollow');
    unfollowButton.on('click',unfollow);
  });
  
  socket.on('unfollowOk',function(data){
    //remove the li which contains the session user nickname
    $('.followers ul li').each(function(index){
      if($(this).html() === data.nickname) {
        $(this).fadeOut();
        return;
      }
    });
    $('#button-unfollow').replaceWith('<a id="button-follow" href="#follow">Follow</a>');    
    followButton = $('#button-follow');
    followButton.on('click',follow);
  });

  //comments, tab page
  var postComment = $('#submit-comment');
  if(postComment)
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
        var string = '';
        string += '<li class="comment">';
        string += '  <span class="author">'+data.author+'</span> \n';
        string += '  <span class="note">'+data.note+'</span>  \n';
        string += '  <div class="body">'+data.body+'</div> \n';
        string += '</li>';
    
    $('.comments').prepend(string);
  });
  
})();