const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require("../../auth/passport");

router.get('/signin', authController.showSignInPage);
router.get('/signup', authController.showSignUpPage);
router.get('/logout', authController.logout);
router.get('/account-activate', authController.activateAccount);
router.get('/forget-password', authController.showForgetPasswordPage);

router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin?signInFail'}));
router.post('/signup', authController.signUpNewUser);
router.post('/forget-password', authController.sendResetPasswordMail);

module.exports = router;
