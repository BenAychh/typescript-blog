var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/postsWithAuthors', function (req, res, next) {
  models.blogposts.findAll({
    include: [models.authors],
  })
  .then(function (blogPosts) {
    res.json(blogPosts);
  });
});

router.get('/posts', function (req, res, next) {
  models.blogposts.findAll()
  .then(function (blogPosts) {
    res.json(blogPosts);
  });
});

router.post('/blogpost/create', function (req, res, next) {
  console.log('heyyyy');
  models.blogposts.upsert(req.body)
  .then(function (blah) {
    res.json(blah);
  });
});

module.exports = router;
