(function() {
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

  //follow
  var followButton = $('#button-follow');
  var unfollowButton = $('#button-unfollow');
  followButton.on('click',follow);
  unfollowButton.on('click',unfollow);

  socket.on('followerAdded',function(data) {
    //hide the list
    var $list = $(".followers ul").hide();
    //use the add method to push a new element in the ul
    var string = '<div class="rounded">'
    string += "<li><a href=\"/user/profil/"+data.nickname+"\"> "+'<img src="'+data.image+'"></a></li>';
    string += '</div>';
    $list.append(string);
    //show the list with the new element
    $list.fadeIn();

    $('#button-follow').replaceWith('<a id="button-unfollow" href="#unfollow">Unfollow</a>');
    unfollowButton = $('#button-unfollow');
    unfollowButton.on('click',unfollow);
  });
  
  socket.on('unfollowOk',function(data){
    //remove the li which contains the session user nickname
    $('.followers ul li a').each(function(index){
      if($(this).attr('href') === '/user/profil/'+data.id) {
        $(this).parent().parent().fadeOut();
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

  //socket which manages tab uploaded  
  socket.on('tabAdded',function(data){
    $('#upload-tab').hide();
    $('#upload-tab .glyphicon').remove();
    $('#upload-tab').append('<span class="glyphicon glyphicon-ok-circle"></span>');
    $('#upload-tab').fadeIn();
  });


  //socket which manages tab errors
  socket.on('tabUploadError',function(data){
    $('#upload-tab').hide();
    $('#upload-tab .glyphicon').remove();
    $('#upload-tab').append('<span class="glyphicon glyphicon-remove-circle"></span>');
    $('#upload-tab').fadeIn();
  });

  //manage favorites
  $('#favorite-button').on('click',addFavorite);

  function addFavorite() {
    //get the current tab id
    var url = location.pathname;
    var tabId = url.split('/')[3].match('[0-9]*')[0];
    socket.emit('addFavorite',{
      id:tabId
    });
  }

  socket.on('favoriteAdded',function(data){
    $('#favorite-button');
  });

})(socket);