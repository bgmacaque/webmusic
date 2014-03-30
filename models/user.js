//user model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    password: DataTypes.TEXT,
    lastname: DataTypes.STRING,
    birthday : DataTypes.STRING,
    nickname : DataTypes.STRING,
    description : DataTypes.TEXT,
    email : DataTypes.STRING,
    salt : DataTypes.TEXT,
    image : {
      type : DataTypes.TEXT,
      defaultValue: "/images/profiles/macaque.png"
    }
  });
 
  return User;
}

