var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function (req, res, next) {
  console.log(req.query);
  models.authors.findAll({
    limit: req.query.aLimit,
    offset: req.query.aOffset,
  })
  .then(function (authors) {
    res.json(authors);
  });
});

router.get('/withPosts/', function (req, res, next) {
  models.authors.findAll({
    include: [
      {
        model: models.blogposts,
        limit: req.query.pLimit,
        offset: req.query.pOffset,
      },
    ],
    limit: req.query.aLimit,
    offset: req.query.aOffset,
  })
  .then(function (authors) {
    res.json(authors);
  });
});

router.get('/:id', function (req, res, next) {
  models.authors.findAll({
    where: {
      id: req.params.id,
    },
  })
  .then(function (authors) {
    res.json(authors);
  });
});

router.get('/:id/withPosts', function (req, res, next) {
  models.authors.findAll({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: models.blogposts,
        limit: req.query.pLimit,
        offset: req.query.pOffset,
      },
    ],
  })
  .then(function (authors) {
    res.json(authors);
  });
});

module.exports = router;
