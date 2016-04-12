var express = require('express');
var router = express.Router();
var passport = require('../auth/auth.js');
var models = require('../models');

router.get('/', passport.authenticate('github'), (req, res, next) => {
  passport.authenticate('github')(req, res, next);
});

if (process.env.DEVELOPMENT == 'true') {
  router.get('/test', passport.authenticate('testing'), (req, res, next) => {
    res.json(req.user);
  });
}

router.get('/callback/',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res, next) => res.send('logged in')
);

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
