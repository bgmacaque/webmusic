"use strict";
//dependencies
var mysql = require("mysql");
var chai = require("chai");
var assert = chai.assert,
		expect = chai.expect,
		should = chai.should();

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
    })
  })

})