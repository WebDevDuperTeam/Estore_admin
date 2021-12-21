const authService = require('./authService');
const mailService = require('../mail/mailService');
const accountsService = require('../accounts/accountsService');

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
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

    else{ //All info has been filled
        try{
            const valid = true;//mailService.checkEmailValidity(email);

            if (!valid) { //email is not valid
                res.render('signup', {emailInvalid: true, layout: 'signLayout'});
            } else { //email is valid
                const user = await authService.registerUser(firstName, lastName, email, password);
                await mailService.sendActivationMail(user.EMAIL, user.TEN, user.TOKEN);
                res.render('activationMailSent', {email: user.EMAIL, layout: 'blankLayout'});
            }
        }
        catch (err) {
            if(err.name === 'Email has been registered'){
                res.render('signup', {alreadyRegistered: true, layout: 'signLayout'});
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
            //TODO: Create views for activate failed and success
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
