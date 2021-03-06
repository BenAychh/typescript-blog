'use strict';
module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    githubId: DataTypes.INTEGER,
    profileUrl: DataTypes.STRING,
    userName: DataTypes.STRING,
    isAuthor: DataTypes.BOOLEAN,
    isSuper: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function (models) {
        users.hasMany(models.blogposts);
      },
    },
  });
  return users;
};
