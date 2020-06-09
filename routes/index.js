var express = require('express');
var router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
/* GET home page. */




router.get('/login', function(req, res){
  res.render('Login', {
    title: 'Express',
    user: req.user
  });
});

router.get('/register', function(req, res) {
  res.render('Register', {
    user: req.user
  });
});

router.get('/',connectEnsureLogin.ensureLoggedIn(),function(req, res) {
  res.render('Homepage', {
    user: req.user
  });
});


// router.get('/login',function(req,res,next){
//   res.render("Login",{title:'Login'})
//    });
  
// router.get('/register', function(req, res, next) {
//   res.render('Register', { title: 'Express' });
// });

// router.get('/',connectEnsureLogin.ensureLoggedIn(),function(req, res){

//     res.render('Homepage', {root: __dirname})

//   });

//   router.get('/about',function(req, res){

//     res.render('About', {root: __dirname})

//   });





module.exports = router;
