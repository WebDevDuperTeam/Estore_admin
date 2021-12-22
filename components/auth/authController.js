const authService = require('./authService');
const mailService = require('../mail/mailService');
const accountsService = require('../accounts/accountsService');
const crypto = require('crypto');

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.showForgetPasswordPage = (req, res) => {
    res.render('forgetPassword', {layout: 'blankLayout'});
}

exports.showSignInPage = (req, res) => {
    res.render('signin', { title: 'Sign in', layout: "signLayout", signInFail: req.query.signInFail !== undefined});
}

exports.showSignUpPage = (req, res) => {
    res.render('signup', { title: 'Sign Up', layout: "signLayout" });
}

exports.signUpNewUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if(!email || !password || !firstName || !lastName){ //Check if user has input all info needed
        res.render('signup', {missingInfo: true, layout: 'signLayout'});
    }
    //TODO: Check confirm password vs password

    else{   //All info has been filled
        try{
            const deliverable = mailService.checkEmailDeliverability(email);

            if (!deliverable) { //cannot send mail there
                res.render('signup', {emailInvalid: true, layout: 'signLayout'});
            } else { //mail can be sent
                const user = await authService.registerUser(firstName, lastName, email, password);
                await mailService.sendActivationMail(user.EMAIL, user.TEN, user.TOKEN);
                res.render('activationMailSent', {email: user.EMAIL, layout: 'blankLayout'});
            }
        }
        catch (err) {
            if(err.name === 'Email has been registered'){
                res.render('signup', {alreadyRegistered: true, layout: 'signLayout'});
            }
            else if(err.name === 'Unsupported Email Service'){
                //TODO: design domainNotSupported page
                res.render('domainNotSupported', {layout: 'blankLayout'});
            }
            else{
                res.render('error', {error: err, layout: 'blankLayout'});
            }
        }
    }
}

exports.activateAccount = async (req, res) => {
    const url = req.originalUrl;
    const token = url.substring(url.lastIndexOf('/') + 1);

    try{
        //get user with token and still has not expired
        const user = await accountsService.getUserWithToken(token);

        if (user) { //user found
            await authService.activateUser(user.USER_ID);
            res.render('activateSuccess', {layout: 'blankLayout'});
        } else { //user not found
            res.render('activateFailed', {layout: 'blankLayout'});
        }
    }
    catch (err){
        res.render('error', {error: err, layout: 'blankLayout'});
    }
}

exports.sendResetPasswordMail = async (req, res) => {
    const email = req.body.email;
    const user = await accountsService.getUserWithEmail(email, true);

    if(user){   //found legit user
        try {
            const token = crypto.randomBytes(64).toString('hex');
            await accountsService.setNewTokenForUser(user.USER_ID, token);
            await mailService.sendResetPasswordMail(email, user.TEN, token);

            res.render('forgetPassword', {layout: 'blankLayout', emailSent: user.EMAIL});
        }
        catch (err) {
            res.render('error', {error: err, layout: 'blankLayout'});
        }
    }
    else{   //cannot found user with email provided
        res.render('resetPasswordFailed', {layout: 'blankLayout'});
    }
}

exports.resetPassword = (req, res) => {

}
