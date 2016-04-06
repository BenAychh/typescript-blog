'use strict';
module.exports = function(sequelize, DataTypes) {
  var blogposts = sequelize.define('blogposts', {
    authorId: DataTypes.INTEGER,
    blogText: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        blogposts.belongsTo(models.authors);
      },
    }
  });
  return blogposts;
};
