const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require("../../auth/passport");

router.get('/signin', authController.showSignInPage);
router.get('/signup', authController.showSignUpPage);
router.get('/logout', authController.logout);
router.get('/account-activate/:token', authController.activateAccount);

router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin?signInFail'}));
router.post('/signup', authController.signUpNewUser);

module.exports = router;
