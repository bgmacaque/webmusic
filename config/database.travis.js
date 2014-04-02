module.exports = {
	database: 'myapp_test',	
	user: 'travis',	
	host: '127.0.0.1',	
	password: null,
  options : {
    dialect: "mysql",
    host : 'localhost',
    logging:false,
    define: { 
      underscored: true
    }
  }
}