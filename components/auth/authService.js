const {models} = require("../../models");
const bcrypt = require("bcrypt");
const users = models.users;
const salt = 10;

exports.registerUser = async (firstName, lastName, email, password) => {
    const checkUser = await users.findOne({where: {EMAIL: email}});
    if(checkUser){
        throw new Error("Email already registered");
    }
    const hashPassword = await bcrypt.hash(password, salt);
    return await users.create({FIRSTNAME: firstName, LASTNAME: lastName, EMAIL: email, PASS: hashPassword});
}