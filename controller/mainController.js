const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const chalk = require('chalk');

const passport = require('passport');

//get main
exports.user_main_get = function (req, res, next) {
  Message.find().populate('user','firstname lastname member').exec((err,results)=>{
    if(err){
      return next(err)
    }else{
        res.render('index',{results:results,member:req.user.member,authenticated:true,admin:req.user.admin})
    }
  })
};

//member functions
exports.main_member_get = function (req, res, next) {
  res.render('member',{authenticated:true})
};
exports.main_member_post = function (req, res, next) {
  const {answer}=req.body;
  if (answer==='passport') {
    User.findByIdAndUpdate(req.user._id,{member:true},{},(err,result)=>{
      if(err){
      return next(err)
      } 
      res.redirect('/main')
    })
  } else {
    req.flash('error_msg','answer is not correct,try again')
    res.redirect('/main/member')
  }
  
};

//admin functions
exports.main_admin_get = function (req, res, next) {
  res.render('admin',{authenticated:false})
};
exports.main_admin_post = function (req, res, next) {
  const {password}=req.body;
  if (password===process.env.ADMIN) {
    User.findByIdAndUpdate(req.user._id,{admin:true},{},(err,result)=>{
      if(err){
      return next(err)
      } 
      res.redirect('/main')
    })
  } else {
    req.flash('error_msg','password is not correct,try again')
    res.redirect('/main/admin')
  }
};

//new message functions
exports.main_message_get = function (req, res, next) {
  res.render('message_form', { authenticated: true });
};

exports.main_message_post = [
  //
  check('msg')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Message must be at least 1 char long'),
  check('subject')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Subject must be at least 1 char long'),
  
  //sanitize
  body('subject').escape(),
  body('mamama').escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('message_form', { errors: errors.array() });
    } else {
      const { subject, msg} = req.body;
      const created = Date.now();
      const user = req.user._id;

      const newMessage = new Message({
        subject,
        message:msg,
        created,
        user,
      });
      newMessage.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/main')
      });
    }
  },
];

exports.main_delete_get=function(req,res,next){
  Message.findByIdAndDelete(req.params.id).exec((err,results)=>{
    if(err){
      return next(err)
    }else{
      console.log(chalk.blue('succesfully removed user'))
      res.redirect('/main')
    }
  })
}