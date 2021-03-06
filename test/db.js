var assert = require("assert");
var should = require("chai").should();
var db = require('../models');
db.sequelize.sync({force:true});
var User = db.User;
var Tab = db.Tab;


describe('User', function(){

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

    it('should create two new users and insert them on the database', function(done){
      var user = User.build({
        firstname: 'a',
        lastname: 'a',
        birthday : '01/01/1999',
        nickname : 'a',
        description : 'a',
        email : 'a@a',
        password: 'a'
      });
      var user2 = User.build({
        firstname: 'b',
        lastname: 'b',
        birthday : '01/01/1999',
        nickname : 'b',
        description : 'b',
        email : 'b@b',
        password: 'b'        
      });
      user.save().success(function(){
        user2.save().success(function(){
          done();
        });
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


