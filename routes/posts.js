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
    include: [models.users],
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
    include: [models.users],
  })
  .then(function (posts) {
    res.json(posts[0]);
  });
});

router.post('/create', function (req, res, next) {
  var postInfo = req.body;
  postInfo.createdAt = new Date();
  postInfo.updatedAt = new Date();
  models.blogposts.create(postInfo)
  .then(function (newPost) {
    res.send(newPost);
  })
  .catch(function (err) {
    res.send('Error!: ', err);
  });
});

module.exports = router;
