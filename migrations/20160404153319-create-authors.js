'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      githubId: {
        type: Sequelize.INTEGER,
      },
      profileUrl: {
        type: Sequelize.STRING,
      },
      userName: {
        type: Sequelize.STRING,
      },
      isAuthor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isSuper: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
    .then(function () {
      return queryInterface.createTable('blogposts', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        authorId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        blogText: {
          type: Sequelize.TEXT,
        },
        published: {
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('blogposts')
    .then(function () {
      return queryInterface.dropTable('authors');
    });

  },
};
