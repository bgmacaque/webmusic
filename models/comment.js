//Comment model
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    body: DataTypes.TEXT,
  	note: DataTypes.INTEGER
  });
 
  return Comment;
};