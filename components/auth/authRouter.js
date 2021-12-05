const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require("../../auth/passport");

router.get('/signin', authController.showSignInPage);
router.get('/signup', authController.showSignUpPage);

router.post('/signin', passport.authenticate('local'), authController.signUserIn);

module.exports = router;
