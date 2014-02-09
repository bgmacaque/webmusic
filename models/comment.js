//Comment model
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    comment_text: DataTypes.TEXT,
  	comment_date: DataTypes.STRING,
  	comment_note: DataTypes.INTEGER
  });
 
  return Comment;
};