var db = require('../models');
var crypto = require('crypto');


//make the hash to save a user
var toHash = function(nickname,password,firstname) {
  firstname = firstname || '';
  lastname = lastname || '';
  var salt = firstname+ 'babek' + nickname;
  return hash = crypto.createHmac('sha512',salt).update(password).digest('hex');
}

//check the nickname and the password 
var check = function(nickname,password,callback) {
  //iteration to avoid DOS attacks 
  var i =0;
  while(i<30000) {
    i++;
    var hash = toHash(nickname,password);
  }

  var query = 'nickname = \''+data.nickname+'\'';
  db.User.find({where: query})
  .success(function(user) {
    if(user) {
      var hash = toHash(nickname,password,user.nickname,user.firstname);
      if(hash === password ) {
        callback(null,user);
      }
      else {
        callback(new Error('NICKNAME OR PASSWORD :o'));
      }
    } else {
      callback(new Error('USER NOT FOUND'));
    }
  }); 
}

exports.connect = function(socket,data) {
    check(data.nickname,data.password,function(err,user) {
      if(err)
        socket.emit('connection-error');
      else
        socket.emit('connected',user);
    });
};
