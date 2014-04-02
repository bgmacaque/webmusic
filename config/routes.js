module.exports = function(app) {

  //loading controllers
  var routes = require('../controllers');
  var user = require('../controllers/user');
  var about = require('../controllers/about');
  var band = require('../controllers/band');
  var tab = require('../controllers/tab');
  var search = require('../controllers/search');
  var authenticate = require('../controllers/authenticate');
  var listing = require('../controllers/listing');
	app.get('/', routes.index);
	//users
  app.get('/user/list',user.list);
	app.get('/user/create',user.create);
  app.post('/user/save',user.save);
  app.get('/user/profil/:id',user.profil);
  app.get('/user/profile/:id',tab.profil);

  app.get('/user/favorites/:id',tab.getAllFavorites);
  app.get('/user/tabs/:id',user.getTabs);
  //bands
  app.get('/band/create',band.create);
  app.post('/band/save',band.save);
  app.get('/band/:id',band.profil);
  app.post('/band/:id/user/add',band.addUser);
  //tabs
  app.get('/tab/profil/:id',tab.profil);
  app.get('/tab/profile/:id',tab.profil);

  app.get('/tab/create',tab.create);
  app.get('/tab/download/:id',tab.download);

  //update the current user
  app.get('/user/update/:id',user.update);
  //search
  app.get('/search',search.index);
  //about
  app.get('/about',about.about);
  //listing
  app.get('/listing',listing.index);
  //login and logout
  app.post('/login',user.login);
  app.post('/logout',user.logout);
  //send the profile image
  app.post('/upload/img',user.uploadImg);
};
