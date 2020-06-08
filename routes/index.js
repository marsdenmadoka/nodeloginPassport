var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const connectEnsureLogin = require('connect-ensure-login');
/* GET home page. */
mongoose.connect('mongodb://localhost:27017/Registerforms',{useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 


router.get('/login',function(req,res,next){
  res.render("Login",{title:'Login'})
   });
  
router.get('/', function(req, res, next) {
  res.render('Register', { title: 'Express' });
});

router.get('/home',connectEnsureLogin.ensureLoggedIn(),function(req, res){

    res.render('Homepage', {root: __dirname})

  });

  router.get('/about',function(req, res){

    res.render('About', {root: __dirname})

  });





module.exports = router;
