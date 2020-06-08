const User = require('../models/User');
const Message = require('../models/Message');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const chalk = require('chalk');


//get index

exports.user_index_get=function (req, res, next) {
  Message.find().populate('user','firstname lastname').exec((err,results)=>{
    if(err){
      return next(err)
    }else{
      res.render('index',{results:results,authenticated:false,member:false,admin:false})
    }
  })
}

//signup functions

exports.user_signup_get = function (req, res, next) {
  res.render('signup', { errors: '' });
};

(exports.user_signup_post = [
  //
  check('username')
    .isLength({ min: 5 })
    .trim()
    .withMessage('Username must be at least 5 chars long'),
  check('firstname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Name must be at least 1 char long'),
  check('lastname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('surname must be at least 1 char long'),
  check('password')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage(
      'Password must contain at least 6 characters,including at least one number and letter'
    ),

  body('username').escape(),
  body('firstname').escape(),
  body('lastname').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signup', { errors: errors.array() });
    } else {
      const { username, firstname, lastname, password } = req.body;
      const member = false;
      const admin = false;
      const newUser = new User({
        username,
        firstname,
        lastname,
        password,
        member,
        admin,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
          if (err) throw err;
          newUser.password = hashedPassword;
          newUser.save((err) => {
            if (err) {
              res.render('error', { error: err });
            } else {
              console.log(
                chalk.greenBright('user above is sucessfully saved to db')
              );
              res.redirect('/login');
            }
          });
        });
      });
    }
  },
]),


  //login functions
  (exports.user_login_get = function (req, res, next) {
    res.render('login', { messages: null });
  });

exports.user_login_post = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect('/login');
};


//authenticate
exports.authenticate = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log(chalk.green('user is Authenticated'));
    next();
  } else {
    req.flash('error_msg','User is not authenticated, please log in')
    res.redirect('/login');
  }
};
