const passport = require('../../auth/passport');

exports.signUserIn = (req, res) => {
    console.log('signin successful');
    if(req.user){
        res.redirect('/');
    }
    else{
        res.redirect('/signin');
    }
}

exports.showSignInPage = (req, res) => {
    res.render('signin', { title: 'Sign in', layout: "signLayout"});
}

exports.showSignUpPage = (req, res) => {
    res.render('signup', { title: 'Sign Up', layout: "signLayout" });
}