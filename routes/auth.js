var express = require('express');
var router = express.Router();
var passport = require('../auth/auth.js');
var models = require('../models');

router.get('/', (req, res, next) => {
  passport.authenticate('github')(req, res, next);
});

router.get('/callback/',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res, next) => res.send(req.user)
);

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
