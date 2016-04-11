'use strict';
module.exports = function (sequelize, DataTypes) {
  var blogposts = sequelize.define('blogposts', {
    authorId: DataTypes.INTEGER,
    blogText: DataTypes.TEXT,
    published: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function (models) {
        blogposts.belongsTo(models.authors);
      },
    },
  });
  return blogposts;
};
