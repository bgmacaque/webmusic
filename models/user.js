//user model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_firstname: DataTypes.STRING,
    user_lastname: DataTypes.STRING,
    user_birthday : DataTypes.STRING,
    user_nickname : DataTypes.STRING,
    user_description : DataTypes.TEXT,
    user_email : DataTypes.STRING,
    user_signup : DataTypes.STRING
  });
 
  return User;
}

