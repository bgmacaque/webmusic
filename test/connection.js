"use strict";
//dependencies
var mysql = require("mysql");
var chai = require("chai");
var assert = chai.assert,
		expect = chai.expect,
		should = chai.should();
var idMax = -1;
//tests
describe('Base', function(){
  describe('#connexion()', function(){

    it('should get an object which allows to connect at mysql server', function(){
	 		var base = require("../models/Base").getConnection();
	 		base.should.have.property('config');
   		base.config.should.have.property('host');
			base.config.should.have.property('user');
			base.config.should.have.property('database');
			base.config.should.have.property('password');
			base.config.host.should.equal('localhost');
			base.config.user.should.equal('webmusic');
			base.config.database.should.equal('webmusic');
    });
	});

  describe('#query()',function(){
	  it('should launch a query',function() {
	  	//get database object
	   	var db = require('../models/Base').getConnection();
			//query test
			db.query('Select * from tests',function(err,rows){
					should.not.exist(err);
			});
		});
		it('should add a row in database', function(){
			var db = require('../models/Base').getConnection();

			//get the latest inserted id 
			db.query('select * from tests', function(err,rows){
				should.not.exist(err);
				//find the max id
				for(var i = 0; i < rows.length; i++)
					if (rows[i].id >= idMax)
						idMax = rows[i].id;
			});
			//insert a new row and check its id
			db.query('insert into tests(nom) values ("TEST") ', function(err,result) {
				should.not.exist(err);
				var idTest = idMax + 1;
				var insertId = result.insertId
				insertId.should.equal(idTest);
			});
	  });
	});
});
