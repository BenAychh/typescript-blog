var express = require('express');
var router = express.Router();
var models = require('../models');
var helpers = require('../auth/helpers.js');
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

router.get('/snippets', function (req, res, next) {
  if (req.query.pLimit) {
    var limit = Number(req.query.pLimit) + 1;
  }

  models.blogposts.findAll({
    attributes: ['id', 'title', 'description', 'updatedAt'],
    where: {
      published: true,
    },
    order: [['updatedAt', 'DESC']],
    limit: limit,
    offset: req.query.pOffset,
    include: [models.users],
  })
  .then(function (posts) {
    res.json(posts);
  });
});

router.get('/signS3', (req, res) => {
  aws.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
  var s3 = new aws.S3();
  var fileName = new Date().getTime()
    + req.query.fileName.substring(req.query.fileName.lastIndexOf('.'));
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: req.query.fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
    } else {

      var returnData = {
        signedRequest: data,
        url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName,
      };
      res.json(returnData);
    }
  });
});

router.get('/create', helpers.ensureAuthor, function (req, res, next) {
  res.render('createblog', {
    title: 'Express',
    post: {
      title: '',
      description: '',
      blogText: '',
    },
  });
});

router.get('/:id', function (req, res, next) {
  var promises = [];
  promises.push(models.blogposts.find({
    where: {
      id: req.params.id,
      published: true,
    },
    include: [models.users],
  }));
  promises.push(models.blogposts.find({
    attributes: ['id'],
    where: {
      id: {
        $lt: req.params.id,
      },
      published: true,
    },
    order: [['id', 'DESC']],
  }));
  promises.push(models.blogposts.find({
    attributes: ['id'],
    where: {
      id: {
        $gt: req.params.id,
      },
      published: true,
    },
    order: [['id', 'ASC']],
  }));
  Promise.all(promises)
  .then(results => {
    if (results[0]) {
      var object = JSON.parse(JSON.stringify(results[0]));

      if (results[1]) {
        object.previous = results[1].dataValues.id;
      }

      if (results[2]) {
        object.next = results[2].dataValues.id;
      }

      res.json(object);
    } else {
      res.send('Invalid post id');
    }
  })
  .catch(err => {
    res.send('Error! ' + err);
  });
});

router.get('/:id/edit', helpers.ensureAuthor, (req, res, next) => {
  models.blogposts.findById(req.params.id)
  .then(post => {
    res.render('createblog', {
      title: 'Express',
      post: post,
    });
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

router.post('/:id/edit', helpers.ensureAuthor, (req, res, next) => {
  models.blogposts.update(req.body, {
    where: { id: req.params.id },
  })
  .then(() => {
    res.redirect('/blog/' + req.params.id);
  });
});

module.exports = router;
