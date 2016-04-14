'use strict';
module.exports = function (sequelize, DataTypes) {
  var blogposts = sequelize.define('blogposts', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    blogText: DataTypes.TEXT,
    published: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function (models) {
        blogposts.belongsTo(models.users);
      },
    },
  });
  return blogposts;
};
