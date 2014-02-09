var routes = require('../routes');
var user = require('../routes/user');
var about = require('../routes/about');

module.exports = function(app) {
	app.get('/', routes.index);
	app.get('/users',user.list);
	app.get('/users/create',user.create);
};
