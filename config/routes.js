var routes = require('../controllers');
var user = require('../controllers/user');
var about = require('../controllers/about');
var band = require('../controllers/band');
module.exports = function(app) {
	app.get('/', routes.index);
	//users
  app.get('/users',user.list);
	app.get('/user/create',user.create);
  app.post('/user/save',user.save);
  app.get('/user/:id',user.profil);
  //bands
  app.get('/band/create',band.create);
  app.post('/band/save',band.save);
  app.get('/band/:id',band.profil);

};
