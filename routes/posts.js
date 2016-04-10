var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function (req, res, next) {
  models.blogposts.findAll({
    where: {
      published: true,
    },
    limit: req.query.pLimit,
    offset: req.query.pOffset,
    include: [models.authors],
  })
  .then(function (posts) {
    res.json(posts);
  });
});

router.get('/:id', function (req, res, next) {
  models.blogposts.findAll({
    where: {
      id: req.params.id,
      published: true,
    },
    include: [models.authors],
  })
  .then(function (posts) {
    res.json(posts);
  });
});

module.exports = router;
