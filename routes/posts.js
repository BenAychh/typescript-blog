var express = require('express');
var router = express.Router();
var models = require('../models');
var helpers = require('../auth/helpers.js');

router.get('/', function (req, res, next) {
  models.blogposts.findAll({
    where: {
      published: true,
    },
    order: [['updatedAt', 'DESC']],
    limit: req.query.pLimit,
    offset: req.query.pOffset,
    include: [models.users],
  })
  .then(function (posts) {
    res.json(posts);
  });
});

router.get('/create', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show', (req, res, next) => {
  res.render('blogs', { id: 0 });
});

router.get('/show/:id', (req, res, next) => {
  res.render('blogs', { id: req.params.id });
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
    res.json(posts);
  });
});

router.post('/create', helpers.ensureAuthor, function (req, res, next) {
  var postInfo = req.body;
  postInfo.createdAt = new Date();
  postInfo.updatedAt = new Date();
  postInfo.userId = req.user.id;
  models.blogposts.create(postInfo)
  .then(function (newPost) {
    res.send(newPost);
  })
  .catch(function (err) {
    res.send('Error!: ', err);
  });
});

module.exports = router;
