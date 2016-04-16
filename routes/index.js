var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(req.user);
});

router.get('/blog/:pId?', (req, res, next) => {
  if (req.params.pId) {
    res.render('blogs', {
      blogActive: 'active',
      id: req.params.pId,
    });
  } else {
    models.blogposts.findOne({
      order: [['id', 'DESC']],
    })
    .then(result => {
      res.render('blogs', {
        blogActive: 'active',
        id: result.id,
      });
    });
  }
});

module.exports = router;
