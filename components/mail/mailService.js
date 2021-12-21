const nodemailer = require("nodemailer");
const kickbox = require('kickbox').client(process.env.KICKBOX_API_KEY).kickbox();
const hbsNodeMailer = require('nodemailer-express-handlebars');

exports.checkEmailValidity = (email) => {
    let result = 'undeliverable';
    kickbox.verify(email, function (err, response) {
        result = response.body.result;
    });

    return result === 'deliverable';
};

exports.sendActivationMail = async (email, name, token) => {
    const domain = getMailDomain(email);
    let transporter;
    let sender;

    //choose transporter
    switch (domain){
        case 'gmail':
            sender = process.env.GMAIL_ACCOUNT;
            transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.GMAIL_ACCOUNT,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            break;
        case 'outlook':
            transporter = nodemailer.createTransport({
                service: "Outlook365",
                auth: {
                    user: 'annabell.klein68@ethereal.email',
                    pass: '97entGXhaJ4FVj2DbR'
                }
            });
            break;
        case 'yahoo':
            sender = process.env.YAHOO_ACCOUNT
            transporter = nodemailer.createTransport({
                service: "Yahoo",
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
                    user: 'lou.stoltenberg50@ethereal.email',
                    pass: 'dDEFs8NgUgEVCS2rHn'
                }
            });
            break;
        default:
            throw {name: 'Unsupported Email Service', message: '${domain} is not supported. We cannot send mail there.'}
    }
    const options = {
        viewEngine: {
            extname: '.hbs',
            layoutsDir: 'components/mail',
            defaultLayout : 'mailLayout.hbs',
            partialsDir : 'components/mail'
        },
        viewPath: 'components/mail',
        extName: '.hbs'
    };
    //attach hbsNodeMailer plugin
    transporter.use('compile', hbsNodeMailer(options));

    //create message
    const message = {
        from: `"Estore Admin 💼"<${sender}>`,
        to: email,
        subject: "Activate your account ✔",
        text: `Hello ${name}` +
            `Welcome to Estore Admin, we're excited to have you onboard.\n` +
            `In order to activate your acounnt please follow this link:\n` +
            `https://managefahsion.herokuapp.com/account-activate/${token}\n\n` +
            `The link will only be active within the next 24 hours. Please activate your account before it expires.`,
        template: 'activationMail',
        context: {name, token: token}
    };

    // send mail with defined transport object
    await transporter.sendMail(message).catch((err) => {throw err});
};

//return mail domain. Ex: emai@example1.com return "example1"
function getMailDomain(email){
    return email.substring(email.indexOf('@') + 1, email.indexOf('.'));
}