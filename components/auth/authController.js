const passport = require('../../auth/passport');
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

//TODO: cần được kiểm thử chức năng đăng kí
exports.signUpNewUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    if(!email || !password || !firstName || !lastName){
        res.render('signup', {missingInfo: true});
    }
    else{
        try{
            const user = await authService.registerUser(firstName, lastName, email, password);
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        }
        catch (err) {
            res.render('signup', {alreadyRegistered: true});
        }
    }
}