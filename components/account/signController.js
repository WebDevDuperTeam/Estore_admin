exports.showSignInPage = (req, res) => {
    res.render('account/signin', { title: 'Sign in', layout: "account/signLayout"});
}

exports.showSignUpPage = (req, res) => {
    res.render('account/signup', { title: 'Sign Up', layout: "account/signLayout" });
}