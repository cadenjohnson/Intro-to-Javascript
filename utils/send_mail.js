
const nodemailer = require("nodemailer");
const cred = require("./credentials.js");
const get_content = require("./get_content");
const logger = require('./logger');
const db_functions = require("./db_functions");

module.exports = async function sendEmails(db, source, emails) {
    // set server mail service
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: cred.mailer_email(),
            pass: cred.mailer_app_password()
        }
    });

    // send the mail and confirm
    emails.forEach(async function (targetemail, i, array) {
        let acct = await db_functions.getID(db, targetemail);
        let content = await get_content(cred.host_address(), acct.id);

        let mailParams = {
            from: source,
            to: targetemail,
            subject: content[0],
            text: content[1]
        };

        mailTransporter.sendMail(mailParams, function (err, data) {
            if(err) {
                logger.error(`error sending email - ${err.message}`);
            }
        })
    })
}
