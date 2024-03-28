const express = require('express');
const router = express.Router();
const passport = require('passport');
const CatchAsync = require('../helpers/CatchAsync');
const ExpressError = require('../helpers/ExpressError');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controller/users');


router.route('/register')
    .get( users.register)
    .post( CatchAsync(users.postRegister));
    
router.route('/login')
    .get(users.loginForm)
    .post( storeReturnTo ,
 passport.authenticate('local', {failureFlash:true , failureRedirect:'/login'}),
  users.loginAuth);

router.get('/logout', users.logOut); 


module.exports = router;