var assert = require("assert");
var should = require("chai").should();
var db = require('../models');
var User = db.User;
describe('User', function(){
    before(function(done){
        User.sync({force:true})
        .success(function(){
            done();
        })
        .error(function(error){
            done(error);
        });
    });
  describe('#insert()', function(){
    it('should create a new user and insert it on the database', function(done){
    	var user = User.build({
    		user_firstname: 'Kebab',
    		user_lastname: 'Potatoes',
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
  describe('#delete()', function(){
    it('should delete the latest user inserted',function(done){
            User.find({where:{'user_nickname':'ElKebabo'}})
            .success(function(user){
                user.destroy()
                .success(function(){
                done();
                })
                .error(function(error){
                    done(error);
                });
            })
            .error(function(error){
                done(error);
            });
        });
    });   
  });
});