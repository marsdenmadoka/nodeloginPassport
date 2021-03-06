var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session')
var sessionStore = new session.MemoryStore;



 //requring routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  store: sessionStore,
  cookie: { maxAge: 60000 },
  resave: 'true',
  saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

 //routes middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);


// // Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('App listening on port ' + port));


module.exports = app;

//sudo pkill node
//sudo lsof -i :5000

// https://madoka-com.herokuapp.com
