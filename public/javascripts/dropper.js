(function(){
  var dropper = document.querySelector('.dropper');
  
  dropper.addEventListener('dragenter', function(e) {
      e.preventDefault();
      dropper.toggleClass("dropper-active");
  }, false);

  dropper.addEventListener('dragleave',function(e){
    e.preventDefault();
    dropper.toggleClass("dropper");
  },false);
  
  dropper.addEventListener('drop', function(e) {
      e.preventDefault();
      dropper.toggleClass("dropper");
      //create the tab object and send it with socket.io
      var files = e.dataTransfer.files;
      var filenames = "";
      var read;
      for(var i = 0; i < files.length; i++) {
        read = new FileReader();
        read.readAsBinaryString(files[i]);
        read.onloadend = function() {
          alert(read.result);
        }
      }
  
  
  }, false);
})();
