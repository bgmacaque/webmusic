/*
* The idea of this file is to configure a connection to the database
* and to collect all model definitions.
*/
var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , db        = {};

var config = require('../config/database');
var sequelize = new Sequelize(
  config.database, 
  config.user, 
  config.password,
  config.options
);

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  }).
forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

//associations
var User = db.User;
var Comment = db.Comment;
var Tab = db.Tab;
var Band = db.Band;

//define associations
User
  .hasMany(Tab)
  .hasMany(Comment, {foreignKey : 'comment_id'})
  .hasMany(Band)
  .hasMany(User, {as : 'followers', through : 'FollowerUsers'});
Tab
  .belongsTo(User, {as : 'user_author'})
  .hasMany(Comment)
  .hasMany(User) //like
  .belongsTo(Band, {as : 'band_author'});
Band
  .belongsTo(User, {as : 'creator'})
  .hasMany(User)
  .hasMany(Tab);
Comment
  .belongsTo(User)
  .belongsTo(Tab);

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)





