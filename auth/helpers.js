function ensureAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('message', {
      status: 'warning',
      text: 'Please login before accessing that page.',
    });
    res.redirect('/auth/');
  }
};

function ensureAuthor(req, res, next) {
  if (req.user && req.user.isAuthor) {
    next();
  } else {
    req.flash('message', {
      status: 'warning',
      text: 'Please login with an admin account',
    });
    res.redirect('/auth/');
  }
};

function ensureSuper(req, res, next) {
  if (req.user.isSuper) {
    next();
  } else {
    req.flash('message', {
      status: 'warning',
      text: 'Please login with a Super Admin account',
    });
  }
}

function loginRedirect(req, res, next) {
  if (req.user) {
    req.flash('message', {
      status: 'warning',
      text: 'You are already logged in',
    });
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = {
  ensureAuthenticated,
  ensureAuthor,
  loginRedirect,
};
