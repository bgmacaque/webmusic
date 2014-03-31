//tab model
module.exports = function(sequelize, DataTypes) {
  var Tab = sequelize.define('Tab', {
    name: DataTypes.STRING,
    file : DataTypes.TEXT,
    note : DataTypes.INTEGER
  });
 
  return Tab;
};