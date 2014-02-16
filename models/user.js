//user model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    password: DataTypes.STRING,
    lastname: DataTypes.STRING,
    birthday : DataTypes.STRING,
    nickname : DataTypes.STRING,
    description : DataTypes.TEXT,
    email : DataTypes.STRING,
  });
 
  return User;
}

