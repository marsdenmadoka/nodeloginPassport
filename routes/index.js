var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var mongoose = require('mongoose');
const connectEnsureLogin = require('connect-ensure-login');

require('../models/user');
var User = mongoose.model('User');/*fetching the schema from model*/




//we defined our own routes
router.get('/',connectEnsureLogin.ensureLoggedIn(),function(req, res) {
  res.render('Homepage', {
    user: req.user
  });
});


router.get('/LogIn', function(req, res){
  res.render('Login', {
    expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash,
    user: req.user,
  
  });
});

router.get('/RegiSter', function(req, res) {
  res.render('Register', {
    user: req.user
  });
});

router.get('/forgot', function(req, res) {
  res.render('Forgot', {
  expressFlash: req.flash('myflash'), sessionFlash: res.locals.sessionFlash,
    user: req.user
  });
});

module.exports = router;
