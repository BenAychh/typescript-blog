var express = require('express');
var router = express.Router();
var models = require('../models');
var helpers = require('../auth/helpers.js');
var aws = require('aws-sdk');
var md5 = require('js-md5');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

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
  res.render('createblog', { title: 'Express' });
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
