//Band model
module.exports = function(sequelize, DataTypes) {
  var Band = sequelize.define('Band', {
    name: DataTypes.TEXT,
  	creation: DataTypes.STRING
  });
 
  return Band;
};