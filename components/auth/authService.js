const {models} = require("../../models");
const kickbox = require('kickbox').client(process.env.KICKBOX_API_KEY).kickbox();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
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
    expireDate.setHours(expireDate.getHours() + 6); //token will expire after 6 hours
    const expireDateString = expireDate.toISOString();

    //create new account
    return await users.create({TEN: firstName, HO: lastName, EMAIL: email, PASS: hashPass, LA_ADMIN: true,
                                TOKEN: token, NGAY_HET_HAN_TOKEN: expireDateString});
};

exports.checkEmailValidity = (email) => {
    let result = 'undeliverable';
    kickbox.verify(email, function (err, response) {
        result = response.body.result;
    });

    return result === 'deliverable';
};

//TODO: implement send activation email
exports.sendActivationMail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'annabell.klein68@ethereal.email',
            pass: '97entGXhaJ4FVj2DbR'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world. this is 2 </b>", // html body
    }).catch((err) => {throw err});

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};