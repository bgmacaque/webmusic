"use strict";
//dependencies
var mysql = require('mysql');

//mysql config
var config = {
	database: 'webmusic',
	user: 'adonis',
	host: 'localhost',
	password: ''
}

//Base singleton
var Base = (function() {

	//function which makes Base object with options 
	function createSingleton() {
		var options = config;
		/** 
		* set options to the options supplied
		* or an empty object if none are provided
		**/
		options = options || {};

		//mysql object which is used to connect at the mysql server
		return mysql.createConnection({
			database: options.database || "database",
			host: options.host || "localhost",
			user: options.user || "root",
			password: options.password || "root"
		});
	};

	//instance of the singleton
	var instance;

	//makes singleton and returns itself
	var _static = {
			//method to get Base instance
			getConnection: function() {			
				if (instance===undefined) {
					instance = createSingleton();
				}
				return instance;
			}
	};

	//returns the static object when it is created
	return _static;
})();

//export the object base
module.exports = Base;