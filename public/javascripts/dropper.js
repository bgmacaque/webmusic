(function(){
  var dropper = document.querySelector('#upload-tab');

  dropper.addEventListener('dragenter', function(e) {
      e.preventDefault();
  }, false);

  dropper.addEventListener('dragover',function(e){
    e.preventDefault();
  },false);

  dropper.addEventListener('dragleave',function(e){
    e.preventDefault();

  },false);
  
  dropper.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();

      //create the tab object and send it with socket.io
      var files = e.dataTransfer.files;
      var filenames = "";
      var read;
      for(var i = 0; i < files.length; i++) {
        read = new FileReader();
        read.readAsBinaryString(files[i]);
        read.onloadend = function() {
          //send the json tab
          window.socket.send('tabSent',{
            json:read.result
          });
        }
      }
  },false);
})(socket);
