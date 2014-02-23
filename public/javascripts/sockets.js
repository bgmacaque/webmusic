(function(){
  var socket = io.connect('http://localhost');
  var button = (#button-follow);
  button.onClick = function() {
    //send the id of the current user
    socket.emit('follow',{
      idFollower:1
    });
  };
})();