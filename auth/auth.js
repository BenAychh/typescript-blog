var passport = require('passport');
var GitHubStrategy = require('passport-github2');
var models = require('../models');
var Users = models.users();
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  (accessToken, refreshToken, profile, done)  => {
    Users.findAll({
      where: {
        githubId: profile.id,
      },
    })
    .then((results) => {
      if (results.length !== 0) {
        done(null, user[0].id);
      } else {
        Users().create({
          github_id: profile.id,
          display_name: profile.displayName,
          profile_url: profile.profileUrl,
          username: profile.username,
          user_id: user[0].id,
        })
        .then((user) => done(null, user.id))
        .catch((err) => console.log('Error: ' + err));
      }
    });
  }
));

passport.serializeUser((id, done) => done(null, id));

passport.deserializeUser((id, done) => {
  Users().findAll({
    where: {
      id: id,
    },
  });
  then((results) => {
    if (results.length !== 0) {
      done(null, userObject);
    } else {
      done(null, false);
    }
  });
});
