//tab model
module.exports = function(sequelize, DataTypes) {
  var Tab = sequelize.define('Tab', {
    tab_name: DataTypes.STRING,
    tab_file : DataTypes.STRING
  });
 
  return Tab;
};