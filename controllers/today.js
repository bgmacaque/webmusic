//send the current time with mysql format
var ToDay = function() {
  this.now = function(){
    var now = new Date();
    var result = '';
    //year
    result += now.getFullYear()+ " ";
    
    //day
    result+= now.getDate()+" ";

    //month
    result+= now.getMonth() + 1;
        
    return result;
  };
}

module.exports = ToDay;