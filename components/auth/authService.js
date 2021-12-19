const {models} = require("../../models");
const kickbox = require('kickbox').client(process.env.KICKBOX_API_KEY).kickbox();
const bcrypt = require("bcrypt");
const users = models.users;
const salt = 10;

exports.registerUser = async (firstName, lastName, email, password) => {
    //check if email is registered
    const Account = await users.findOne({where: {EMAIL: email, LaAdmin: 'ADMIN'}});
    if(Account) {
        throw new Error('Email is already registered');
    }
    const hashPass = await bcrypt.hash(password, salt);

    const countRows = await models.users.count() + 1;
    let NewID = "US";
    if(countRows > 99) {
        NewID = NewID + countRows.toString();
    }
    else if (countRows > 9){
        NewID = NewID + "0" + countRows.toString();
    }
    else {
        NewID = NewID + "00" + countRows.toString();
    }
    //create new account
    return await users.create({USER_ID: NewID, TEN: firstName, HO: lastName, EMAIL: email, SO_BANKING: 0, PASS: hashPass, LaAdmin: 'ADMIN'});
};

exports.checkEmailValidity = (email) => {
    let result = 'undeliverable';
    kickbox.verify(email, function (err, response) {
        result = response.body.result;
    });

    return result === 'deliverable';
};

//TODO: implement send activation email
exports.sendActivationMail = (email) => {

};