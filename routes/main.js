var express = require('express');
var router = express.Router();
const passport = require('passport');
const chalk = require('chalk');

var userController = require('../controller/userController');
var mainController = require('../controller/mainController');


/* GET users listing. */

router.get('/',userController.authenticate,mainController.user_main_get)

router.get('/member',userController.authenticate,mainController.main_member_get)
router.post('/member',mainController.main_member_post)

router.get('/newMessage',userController.authenticate,mainController.main_message_get)
router.post('/newMessage',mainController.main_message_post)

router.get('/admin',userController.authenticate,mainController.main_admin_get)
router.post('/admin',mainController.main_admin_post)

router.get('/delete/:id',mainController.main_delete_get)

module.exports = router;
