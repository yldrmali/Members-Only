var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression=require('compression')
const helmet=require('helmet')


const flash=require('connect-flash')
const moment=require('moment')
var passport=require('passport');
var mongoose=require('mongoose');
var session=require('express-session');

require('dotenv').config();
require('./config/passport')(passport);

var app = express();

app.use(helmet())
var indexRouter = require('./routes/index');
var mainRouter = require('./routes/main');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
  res.locals.error_msg=req.flash('error_msg')
  res.locals.error=req.flash('error')
  next();
})

app.use('/', indexRouter);
app.use('/main', mainRouter);

// catch 404 and forward to error handler
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

  mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true ,useUnifiedTopology: true});
  var db = mongoose.connection;
  db.on('connected',()=>console.log('connected to mongodb'))
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  
  
  module.exports = app;
