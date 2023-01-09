
const nodemailer = require("nodemailer");
const cred = require("../credentials.json");
const logger = require('./logger');

module.exports = async function sendEmails(source, emails, subject, body) {
    // set server mail service
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: cred.mailer_email,
            pass: cred.mailer_app_password
        }
    });

    // send the mail and confirm
    emails.forEach(function (targetemail, i, array) {
        let mailParams = {
            from: source,
            to: targetemail,
            subject: subject,
            text: body
        };

        mailTransporter.sendMail(mailParams, function (err, data) {
            if(err) {
                logger.error(`error sending email - ${err.message}`);
            }
        })
    })
}
