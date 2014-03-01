/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var db = require('./models');
var io = require('socket.io');
var cookieParser = express.cookieParser();

//define the secret string to crypt cookies
var SITE_SECRET = process.env.SECRET || 
									require('./config/session').secret() ||
									'test';
//handlebarjs
var hbs = require('express3-handlebars').create({
	helpers: {
		img: function(name,alt) { return '<img src="images/'+name+'" alt="'+alt+'">';},
		styles: function() {
			//get directory name
			var fs = require('fs');
			var files;
			/* make the array which will be used for css files*/
			files= fs.readdirSync(__dirname+'/public/stylesheets');
			//make the string result
			var result='';			
			for (var i = files.length - 1; i >= 0; i--) {
				var file = files[i];
				var tab = file.split('.');
				if (tab[tab.length-1]=='css')
					result+='<link rel="stylesheet" href="/stylesheets/'+file+'">';
			}
			return result;
		},
		css: function(name) {
			return '<link rel="stylesheet" href="/stylesheets/'+name+'.css">';
		},
		js: function(name) {
			return '<script src="/javascripts/'+name+'.js" type="text/javascript"></script>';
		}
	}
});

app.engine('handlebars', hbs.engine);



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//managing session
app.use(cookieParser);
app.use(express.session({
	secret: SITE_SECRET
}));

//res global variables
app.use(function(req, res, next){
	/*
	 * It's used to have session variable everywhere on the website
	 * All handlebars pages which contains {{session}} will be allowed to use it
	 */
  res.locals.session = req.session;
  next();
})

//routes
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//for Sequelize config
app.set('models',require('./models'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//loading the routes
var routes = require('./config/routes')(app);

//start the socket server
var server = http.createServer(app);
io = io.listen(server);

//loading sockets config
var sockets = require('./config/sockets')(io);

//start the express server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
