var db = require('../models');

var Authenticate = {
  //make the hash to save a user

  toHash : function(nickname,password,firstname) {
    var result = {};
    var name = firstname || '';
    result['salt'] = require('crypto').createHmac('md5','ElCavaliero').update('babek'+nickname).digest('hex');
    result['password'] = require('crypto').createHmac('sha512',result.salt).update(password).digest('hex');
    return result;
  },

  //check the nickname and the password 
  check : function(nickname,password,callback) {
    //iteration to avoid DOS attacks 
    var i =0;
    while(i<30000) {
      i++;
      var hash = Authenticate.toHash(nickname,password);
    }
    var query = 'nickname = \''+nickname+'\'';
    db.User.find({where: query})
    .success(function(user) {
      if(user) {
        var hash = Authenticate.toHash(nickname,password,user.firstname);

        if(user.password === hash.password ) {
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
}

module.exports = Authenticate;