//file which is used to calc the line and the number of a note

//calcul the number of the note
exports.calcNumber = function(note,currentChord,currentPos,positions){
  return positions[currentChord][currentPos].number;
}
//calcul the line of the note
exports.calcLine = function(note,currentChord,currentPos,positions) {
  return positions[currentChord][currentPos].line;
}