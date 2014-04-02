//tab model
module.exports = function(sequelize, DataTypes) {
  var Tab = sequelize.define('Tab', {
    name: DataTypes.STRING,
    note : DataTypes.DECIMAL(2,1),
    file : DataTypes.TEXT
  });
 
  return Tab;
};