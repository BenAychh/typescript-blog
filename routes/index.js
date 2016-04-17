var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Work - Ben Hernandez',
    homeActive: 'active',
  });
});

router.get('/contact', (req, res, next) => {
  res.render('contact', {
    title: 'Contact - Ben Hernandez',
    contactActive: 'active',
  });
});

router.get('/howtonot', (req, res, next) => {
  res.render('howtonot', {
    title: 'How To Not - Ben Hernandez',
    howtonotActive: 'active',
  });
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
        title: 'Blog - Ben Hernandez',
      });
    });
  }
});

module.exports = router;
