const {models} = require("../../models");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const users = models.users;
const salt = 10;

//Register a new user (temporarily). User still needs to activate account from his email.
exports.registerUser = async (firstName, lastName, email, password) => {
    //check if email is registered
    const Account = await users.findOne({where: {EMAIL: email, LA_ADMIN: true}});
    if(Account) {
        throw {name: "Email has been registered", message: "Email has already been registered."};
    }

    const hashPass = await bcrypt.hash(password, salt);
    const NewID = uuidv4();
    const token = crypto.randomBytes(64).toString("hex");
    let expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 24); //token will expire after 24 hours
    const expireDateString = expireDate.toISOString();

    //create new account
    return await users.create({TEN: firstName, HO: lastName, EMAIL: email, PASS: hashPass, LA_ADMIN: true,
                                TOKEN: token, NGAY_HET_HAN_TOKEN: expireDateString});
};

exports.activateUser = async (id) => {
    try {
        await users.update({KICH_HOAT: true}, {where: {USER_ID: id}});
    }
    catch (err){
        throw err;
    }
}