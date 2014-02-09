//Comment model
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT,
  	date: DataTypes.STRING,
  	note: DataTypes.INTEGER
  });
 
  return Comment;
};