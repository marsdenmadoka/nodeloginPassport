var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser"); 
var mongoose = require('mongoose');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
//const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/Registerforms',{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
require('../models/user');
var User = mongoose.model('User');/*fetching the schema from model*/



//  app.use(session({ secret: 'session secret key' }));
// app.use(session({ secret: 'session secret key' }))

// passport.use(AddUser.createStrategy());
// passport.serializeUser(AddUser.serializeUser());
// passport.deserializeUser(AddUser.deserializeUser());

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      user.comparePassword(password, function(err, isMatch) {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
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
      if (!user) {
        return res.redirect('/login')
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/home');
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
        res.redirect('/home');
      });
    });
  });
  module.exports = router;

// router.post('/login', (req, res, next) => {

//     passport.authenticate('local',
//     (err, user, info) => {
//       if (err) {
//         return next(err);
//       }
  
//       if (!user) {
//         req.flash('info', 'Flash is back!')
//         return res.redirect('/login?info='+info);
        
//       }
  
//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err);
//         }
  
//         return res.redirect('/');
//       });
  
//     })(req, res, next);

// })

// router.post('/register', function(req, res) {
//     var user = new AddUser({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password
//       });
  

//       db.collection('details').insertOne(user,function(err,collection){
//    req.logIn(user,function(err){
//        if(err)throw err;
//        res.redirect('/')
//    })
        
//       })

//     // user.save(function(err) {
//     //   req.logIn(user, function(err) {
//     //       if(err)throw err;
//     //       console.log('record inserted')
//     //     res.redirect('/');
//     //   });
//     // });
//   });


//   db.collection('details').insertOne(user,function(err, collection){ 
//     if (err) throw err; 
// console.log("Record inserted Successfully");  
// }); 


// AddUser.register({username:'paul', active: false}, 'paul');
// AddUser.register({username:'jay', active: false}, 'jay');
// AddUser.register({username:'roy', active: false}, 'roy');



// router.get('/home', connectEnsureLogin.ensureLoggedIn(),function(req,res,next){
//     res.render('Homepage',{title:'homepae'});
//     });


