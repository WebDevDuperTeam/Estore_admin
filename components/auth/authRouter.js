const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require("../../auth/passport");

router.get('/signin', authController.showSignInPage);
router.get('/signup', authController.showSignUpPage);
router.get('/logout', authController.logout);
router.get('/account-activate', authController.activateAccount);
router.get('/forget-password', authController.showForgetPasswordPage);
//TODO: check reset pass route
router.get('/reset-password', authController.showResetPasswordPage);

router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin?signInFail'}));
router.post('/signup', authController.signUpNewUser);
router.post('/forget-password', authController.sendResetPasswordMail);
//TODO: check reset password process for post req from reset-pass page
router.post('/reset-password', authController.resetPassword);

module.exports = router;
