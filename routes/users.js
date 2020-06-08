var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser"); 
var mongoose = require('mongoose');
var flash = require('connect-flash');
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');


require('../models/user');
var AddUser = mongoose.model('Userdetails');/*fetching the schema from model*/

passport.use(AddUser.createStrategy());
passport.serializeUser(AddUser.serializeUser());
passport.deserializeUser(AddUser.deserializeUser());

router.post('/register',function(req,res,next){

})


router.post('/login', (req, res, next) => {

    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        //req.flash('info', 'Flash is back!')
        return res.redirect('/login?info='+info);
        
      }
  
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
  
        return res.redirect('/home');
      });
  
    })(req, res, next);

})


// AddUser.register({username:'paul', active: false}, 'paul');
// AddUser.register({username:'jay', active: false}, 'jay');
// AddUser.register({username:'roy', active: false}, 'roy');



// router.get('/home', connectEnsureLogin.ensureLoggedIn(),function(req,res,next){
//     res.render('Homepage',{title:'homepae'});
//     });

module.exports = router;
