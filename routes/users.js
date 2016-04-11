var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function (req, res, next) {
  console.log(req.query);
  models.users.findAll({
    limit: req.query.uLimit,
    offset: req.query.uOffset,
  })
  .then(function (users) {
    res.json(users);
  });
});

router.get('/withPosts/', function (req, res, next) {
  models.users.findAll({
    include: [
      {
        model: models.blogposts,
        limit: req.query.pLimit,
        offset: req.query.pOffset,
        where: {
          published: true,
        },
      },
    ],
    limit: req.query.uLimit,
    offset: req.query.uOffset,
  })
  .then(function (users) {
    res.json(users);
  });
});

router.get('/:id', function (req, res, next) {
  models.users.findAll({
    where: {
      id: req.params.id,
    },
  })
  .then(function (users) {
    res.json(users);
  });
});

router.get('/:id/withPosts', function (req, res, next) {
  models.users.findAll({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: models.blogposts,
        limit: req.query.pLimit,
        offset: req.query.pOffset,
        where: {
          published: true,
        },
      },
    ],
  })
  .then(function (users) {
    res.json(users);
  });
});

module.exports = router;
