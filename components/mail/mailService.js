const nodemailer = require("nodemailer");
const kickbox = require('kickbox').client(process.env.KICKBOX_API_KEY).kickbox();
const hbsNodeMailer = require('nodemailer-express-handlebars');

exports.checkEmailDeliverability = (email) => {
    let result = 'undeliverable';
    kickbox.verify(email, function (err, response) {
        result = response.body.result;
    });

    return result === 'deliverable';
};

exports.sendActivationMail = async (email, name, token) => {
    const domain = getMailDomain(email);
    try{
        const transporter = getTransporter(domain);
        const sender = getSender(domain);
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
            context: {name, token}
        };

        // send mail with defined transport object
        await transporter.sendMail(message).catch((err) => {throw err});
    }
    catch (err){
        throw err;
    }
};


exports.sendResetPasswordMail = async (email, name, token) => {
    const domain = getMailDomain(email);

    try{
        const transporter = getTransporter(domain);
        const sender = getSender(domain);

        //create message
        const message = {
            from: `"Estore Admin 💼"<${sender}>`,
            to: email,
            subject: "Reset Password 🔄",
            text: `Hello ${name}` +
                `You requested to have your password reset.\n` +
                `In order to reset password please follow this link:\n` +
                `https://managefahsion.herokuapp.com/forget-password/${token}\n\n` +
                `The link will only be active within the next 24 hours. Please reset your password before it expires.`,
            //TODO: design reset password email
            template: 'resetPasswordMail',
            context: {name, token}
        };

        // send mail with defined transport object
        await transporter.sendMail(message).catch((err) => {throw err});
    }
    catch (err){
        throw err;
    }
};

//return mail domain. Ex: emai@example1.com return "example1"
function getMailDomain(email){
    return email.substring(email.indexOf('@') + 1, email.indexOf('.'));
}

function getSender(domain){
    let sender;
    switch (domain){
        case 'gmail':
            sender = process.env.GMAIL_ACCOUNT;
            break;
        case 'outlook':
            sender = process.env.OUTLOOK_ACCOUNT;
            break;
        case 'yahoo':
            sender = process.env.YAHOO_ACCOUNT;
            break;
        case 'test':
            sender = 'estoreadmintesting@test.com';
            break;
        default:
            throw {name: 'Unsupported Email Service', message: '${domain} is not supported. We cannot send mail there.'}
    }
    return sender;
}

function getTransporter(domain){
    let transporter;
    switch (domain){
        case 'gmail':
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
            transporter = nodemailer.createTransport({
                service: "Yahoo",
                auth: {
                    user: process.env.YAHOO_ACCOUNT,
                    pass: process.env.YAHOO_PASSWORD
                }
            });
            break;
        case 'test':
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'sonya.hodkiewicz77@ethereal.email',
                    pass: 'fDJqhPH9gMGmfg2NAp'
                }
            });
            break;
        default:
            throw {name: 'Unsupported Email Service', message: '${domain} is not supported. We cannot send mail there.'};
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

    return transporter;
}