var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser"); 
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var flash = require('connect-flash');
const { check, validationResult} = require("express-validator");
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/Registerforms',{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

require('../models/user');
var AddUser = mongoose.model('Userdetails');/*fetching the schema from model*/
var app = express();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



passport.use(AddUser.createStrategy());
passport.serializeUser(AddUser.serializeUser());
passport.deserializeUser(AddUser.deserializeUser());

// router.post('/register',function(req,res,next){

// })


router.post('/login', (req, res, next) => {

    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        req.flash('info', 'Flash is back!')
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

  
// router.post('/register',
// async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             errors: errors.array()
//         });
//     }

//     const {
//         username,
//         password,
//     } = req.body;
//     try {
//         user = new AddUser({
//             username,
//             password,
//         });

//         // const salt = await bcrypt.genSalt(10);
//         // user.password = await bcrypt.hash(password, salt);


//        await db.collection('details').insertOne(user,function(err, collection){ 
//                  if (err) throw err; 
//            console.log("Record inserted Successfully");  
//           }); 
                  
//               return res.redirect('/login');
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Error in Saving");
//     }
// }
// );



AddUser.register({username:'paul', active: false}, 'paul');
AddUser.register({username:'jay', active: false}, 'jay');
AddUser.register({username:'roy', active: false}, 'roy');



// router.get('/home', connectEnsureLogin.ensureLoggedIn(),function(req,res,next){
//     res.render('Homepage',{title:'homepae'});
//     });

module.exports = router;
