var routes = require('../controllers');
var user = require('../controllers/user');
var about = require('../controllers/about');
var band = require('../controllers/band');
module.exports = function(app) {
	app.get('/', routes.index);
	app.get('/users',user.list);
	app.get('/user/create',user.create);
  app.post('/user/save',user.save);
  app.get('/user/:id',user.profil);
};
