
var dropper = document.querySelector('.dropper');

dropper.addEventListener('dragover', function(e) {
    e.preventDefault();
}, false);

dropper.addEventListener('drop', function(e) {
    e.preventDefault();

    //create the tab object and send it with socket.io
    var files = e.dataTransfer.files;
    var filenames = "";
    for(var i = 0; i < files.length; i++) {
      read = new FileReader();
      read.readAsBinaryString(files[i]);
      read.onloadend = function() {
        alert(read.result);
      }
    }


}, false);


