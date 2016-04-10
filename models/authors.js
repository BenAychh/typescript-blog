'use strict';
module.exports = function(sequelize, DataTypes) {
  var authors = sequelize.define('authors', {
    email: DataTypes.STRING,
    displayName: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function (models) {
        authors.hasMany(models.blogposts)
      },
    },
  });
  return authors;
};
