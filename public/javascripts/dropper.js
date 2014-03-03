
var dropper = document.querySelector('.dropper');

dropper.addEventListener('dragover', function(e) {
    e.preventDefault();
}, false);

dropper.addEventListener('drop', function(e) {
    e.preventDefault();
    alert("OK!");
    //create the tab object and send it with socket.io

}, false);


