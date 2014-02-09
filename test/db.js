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
    		firstname: 'Kebab',
    		lastname: 'Potatoes',
    		birthday : '01/01/1999',
    		nickname : 'ElKebabo',
    		description : 'I love KEBAB! <3',
    		email : 'kebab@frite.com',
    	});
    	user.save().success(function(userSaved){
    		done();
    	});
    });
  describe('#update()',function(){
    it('should update the latest user inserted',function(done){
      User.find({where:{'nickname':'ElKebabo'}})
        .success(function(user){
          user.nickname = 'BgMacaque';
          user.save().success(function(userSaved){
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
  describe('#delete()', function(){
    it('should delete the latest user inserted',function(done){
        User.find({where:{'nickname':'BgMacaque'}})
        .success(function(user){
          user.nickname.should.equal('BgMacaque');
          user.id.should.equal(1);
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