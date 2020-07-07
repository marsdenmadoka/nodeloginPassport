var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser"); 
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var passport = require('passport');
var crypto = require('crypto');//no need to install crypto it is ready made in nodejs
 require('dotenv').config()
 const Emailaddress=process.env.EMAILADDRESS
 const EmailPassword=process.env.EMAILPASSWORD
 //console.log(Emailaddress,EmailPassword)

mongoose.connect('mongodb://localhost:27017/Registerforms',{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 


require('../models/user');
var User = mongoose.model('User');/*fetching the schema from model*/


// passport.use(AddUser.createStrategy());
// passport.serializeUser(AddUser.serializeUser());
// passport.deserializeUser(AddUser.deserializeUser());

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user){
        req.flash ('success','incorrect Username or password') 
        return res.redirect('/LogIn')
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  });
  


  router.post('/register', function(req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
  
    user.save(function(err) {
      req.logIn(user, function(err) {
          if(err) throw err
        res.redirect('/');
      });
    });
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/LogIn');
  });

     //reset password
//Here we are using async module to avoid nesting callbacks within callbacks within callbacks.
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('myflash', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var transporter = nodemailer.createTransport({
        service: 'Gmail',
          auth: {
            user: Emailaddress,
            pass: EmailPassword
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          req.flash('myflash', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });


  //It immediately checks if there exists a user with a given password reset token and that token has not expired yet.
// If user is found, it will display a page to setup a new password.
router.get("/reset/:token", function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('myflash', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
     res.render('Reset', {
        user: req.user,
      });
  
    });
  });

  router.post('/users/resttoken', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('myflash', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: Emailaddress,
            pass: EmailPassword
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
  



  
  module.exports = router;



// AddUser.register({username:'paul', active: false}, 'paul');
// AddUser.register({username:'jay', active: false}, 'jay');
// AddUser.register({username:'roy', active: false}, 'roy');


