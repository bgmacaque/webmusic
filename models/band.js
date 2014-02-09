//Band model
module.exports = function(sequelize, DataTypes) {
  var Band = sequelize.define('Band', {
    group_name: DataTypes.TEXT,
  	group_creation: DataTypes.STRING
  });
 
  return Band;
};