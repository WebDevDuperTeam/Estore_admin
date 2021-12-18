const authService = require('./authService');
const kickbox = require('kickbox')
    .client('live_e28a524a39ae76e0527883267a85c1918a2a2be6ba8544083cf346fbd6816eb6')
    .kickbox();

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
    else{ //All info has been filled
        try{
            //validate email user signed up with
            let result = 'undeliverable';
            kickbox.verify(email, function (err, response) {
                result = response.body.result;
            });

            if(result === 'deliverable'){
                //TODO: send activation email

                //if activate successfully, register in database
                const user = await authService.registerUser(firstName, lastName, email, password);
                req.login(user, function() {
                    return res.redirect('/');
                });
            }
            else{
                res.render('signup', {emailInvalid: true, layout: 'signLayout'});
            }
        }
        catch (err) {
            res.render('signup', {alreadyRegistered: true, layout: 'signLayout'});
        }
    }
}