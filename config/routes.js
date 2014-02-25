module.exports = function(app) {
  //loading controllers
  var routes = require('../controllers');
  var user = require('../controllers/user');
  var about = require('../controllers/about');
  var band = require('../controllers/band');
  var tab = require('../controllers/tab');
  var search = require('../controllers/search');
	app.get('/', routes.index);
	//users
  app.get('/user/list',user.list);
	app.get('/user/create',user.create);
  app.post('/user/save',user.save);
  app.get('/user/profil/:id',user.profil);
  //bands
  app.get('/band/create',band.create);
  app.post('/band/save',band.save);
  app.get('/band/:id',band.profil);
  app.post('/band/user/add',band.addUser);
  //tabs
  app.get('/tab/profil/:id',tab.profil);
  app.get('/tab/list',tab.list);
  app.get('/tab/create',tab.create);

  //search
  app.get('/search',search.index);
  //about
  app.get('/about',about.about);
};
