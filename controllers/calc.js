//file which is used to calc the line and the number of a note

//calcul the number of the note
exports.calcNumber = function(note){
  var numbers = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':6, 'G':7};
  return numbers[note[0]];
}
//calcul the line of the note
exports.calcLine = function(note) {
  var line =  (note.length == 3) ? note[2] : note[1];
  return line;
}