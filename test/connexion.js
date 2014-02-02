"use strict";
//dependencies
var assert = require("assert")
var mysql = require("mysql");
//tests
describe('Base', function(){
  describe('#connexion()', function(){
    it('should get an object which allows to connect at mysql server', function(){
    		var base = require("../models/Base").getConnection();
    		assert(base);
    })
  })
  
})