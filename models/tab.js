//tab model
module.exports = function(sequelize, DataTypes) {
  var Tab = sequelize.define('Tab', {
    name: DataTypes.STRING,
    file : DataTypes.TEXT,  //it should be a MEDIUM TEXT in mysql database
    note : DataTypes.DECIMAL(2,1)
  });
 
  return Tab;
};