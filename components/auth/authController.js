const authService = require('./authService');
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
            //TODO: check if email is valid
            const valid = true;//authService.checkEmailValidity(email);

            if (!valid) { //email is not valid
                res.render('signup', {emailInvalid: true, layout: 'signLayout'});
            } else { //email is valid
                const user = await authService.registerUser(firstName, lastName, email, password);
                await authService.sendActivationMail(user.EMAIL, user.TEN, user.TOKEN);
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

exports.verify = (req, res) => {

}
