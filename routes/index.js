var express = require('express');
var router = express.Router();
const passport = require('passport');
const chalk = require('chalk');

var userController = require('../controller/userController');
var mainController = require('../controller/mainController');

/* GET home page. */
router.get('/', userController.user_index_get);


/* GET authorized home page. */
// router.get('/main',userController.authenticate,userController.user_main_get)

//log-in
router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);

//logout
router.get('/logout', userController.user_logout_get);


//sign-up
router.get('/signup', userController.user_signup_get);
router.post('/signup', userController.user_signup_post);



module.exports = router;
