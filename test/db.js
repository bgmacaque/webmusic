var assert = require("assert");
var should = require("chai").should();
var db = require('../models');
var User = db.User;
describe('User', function(){
  describe('#insert()', function(done){
    it('should create a new user and insert it on the database', function(){
    	var user = User.build({
    		user_firstname: 'Kebab',
    		user_lastname: 'Frite',
    		user_birthday : '01/01/1999',
    		user_nickname : 'ElKebabo',
    		user_description : 'I love KEBAB! <3',
    		user_email : 'kebab@frite.com',
    	});
    	user.save().success(function(userSaved){
    		console.log(userSaved);
    		done();
    	});
    });
  });
});