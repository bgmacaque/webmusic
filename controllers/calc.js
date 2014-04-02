//file which is used to calc the line and the number of a note

//calcul the number of the note
exports.calcNumber = function(note,currentPos,positions){
  return positions[currentPos].number;
}
//calcul the line of the note
exports.calcLine = function(note,currentPos,positions) {
  return positions[currentPos].line;
}