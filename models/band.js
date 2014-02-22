//Band model
module.exports = function(sequelize, DataTypes) {
  var Band = sequelize.define('Band', {
    name: DataTypes.STRING,
  	creation: DataTypes.STRING,
    description: DataTypes.TEXT,
    author: DataTypes.INTEGER
  });
 
  return Band;
};