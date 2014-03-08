/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./models');
var app = express();

//define the secret string to crypt cookies
var SITE_SECRET = process.env.SECRET || 
									require('./config/session').secret() ||
									'test';
var cookieParser = express.cookieParser('your secret sauce');
var sessionStore = new express.session.MemoryStore();




// all environments
app.engine('handlebars', require('./config/hbs').engine);
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
	store: sessionStore

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

//start the socket server
var server = http.createServer(app);
var io = require('socket.io').listen(server);

//define the session socket
var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io,sessionStore,cookieParser);

sessionSockets.io = function() {
	return  io;
};

//loading the routes
var routes = require('./config/routes')(app);

//loading sockets config
var sockets = require('./config/sockets')(sessionSockets);

//start the express server
server.listen(app.get('port'));
