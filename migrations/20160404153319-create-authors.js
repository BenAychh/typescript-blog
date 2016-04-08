'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      displayName: {
        type: Sequelize.STRING,
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
    .then(function (result) {
      console.log('result', result);
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
            model: 'authors',
            key: 'id',
          },
        },
        blogText: {
          type: Sequelize.TEXT,
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
    })
    .then(function () {
      return queryInterface.bulkInsert('authors', [
        {
          email: 'ben.tomas.hernandez@gmail.com',
          displayName: 'BenAychh',
          createdAt: 'now()',
          updatedAt: 'now()',
        },
      ]);
    })
    .then(function () {
      return queryInterface.bulkInsert('blogposts', [
        {
          authorId: 1,
          blogText: 'This is a test!',
          createdAt: 'now()',
          updatedAt: 'now()',
        },
      ]);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('blogposts')
    .then(function () {
      return queryInterface.dropTable('authors');
    });

  },
};
