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
    expireDate.setHours(expireDate.getHours() + 24); //token will expire after 24 hours
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
exports.sendActivationMail = async (email, name, token) => {
    const domain = getMailDomain(email);
    let transporter;
    let sender;

    //choose transporter
    switch (domain){
        case 'gmail':
            sender = process.env.GMAIL_ACCOUNT;
            transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_ACCOUNT,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            break;
        case 'outlook':
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'annabell.klein68@ethereal.email',
                    pass: '97entGXhaJ4FVj2DbR'
                }
            });
            break;
        case 'yahoo':
            sender = process.env.YAHOO_ACCOUNT
            transporter = nodemailer.createTransport({
                host: 'smtp.mail.yahoo.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.YAHOO_ACCOUNT,
                    pass: process.env.YAHOO_PASSWORD
                }
            });
            break;
        case 'test':
            sender = 'estoreadmintesting@test.com'
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'laurine.waters20@ethereal.email',
                    pass: '9Hfu5mrXgCkzy8hQhN'
                }
            });
            break;
        default:
            throw {name: 'Unsupported Email Service', message: '${domain} is not supported. We cannot send mail there.'}
    }

    //create message
    const message = {
        from: `"Estore Admin 💼"<${sender}>`,
        to: email,
        subject: "Activate your account ✔",
        text: `Hello ${name}` +
            `Welcome to Estore Admin, we're excited to have you onboard.` +
            `In order to activate your acounnt please follow this link below:` +
            `https://managefahsion.herokuapp.com/account-activate/${token}` +
            `The link will only be active within the next 24 hours.`,
        html:
            `<div class="container-fluid px-2 px-md-4">` +
             `<div class="page-header min-height-300 border-radius-xl mt-4" style="background-image: url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');">\n ` +
             `   <span class="mask  bg-gradient-primary  opacity-6"></span>\n ` +
             `   </div>\n ` +
             `   <div class="card card-body mx-3 mx-md-4 mt-n6">\n ` +
             `       <div class=\'mb-3\'>\n ` +
             `           <h6>Hello ${name},</h6>\n ` +
             `           <br>\n` +
             `           <p>Welcome to Estore Admin, we\'re excited to have you onboard.</p>\n` +
             `           <p>In order to activate your acounnt please press the button below.\n` +
             `           You will be directed to our website and your account will be activated.</p>\n ` +
             `      </div>\n` +
             `       <div class="d-flex justify-content-center mb-3">\n ` +
             `           <button type="button" class="btn bg-gradient-primary btn-lg w-80"\n ` +
             `               href="https://managefahsion.herokuapp.com/account-activate/${token}">\n ` +
             `                   Activate my account\n ` +
             `           </button>\n ` +
             `       </div>\n ` +
             `       <div>\n ` +
             `           <p class="lead">Please note that you need to activate your account within the next\n ` +
             `                      24 hours before it expires</p>\n ` +
             `       </div>\n ` +
             `   </div>\n ` +
             `</div> `
    };

    // send mail with defined transport object
    await transporter.sendMail(message).catch((err) => {throw err});
};

//return mail domain. Ex: emai@example1.com return "example1"
function getMailDomain(email){
    return email.substring(email.indexOf('@') + 1, email.indexOf('.'));
}