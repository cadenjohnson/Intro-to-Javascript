
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const cred = require("./credentials.json");

// establish timing schedule
cron.schedule("0 5 * * 0-6", function (target_email) {
    // set server mail service
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "<my-email>@gmail.com",
            pass: cred.mailer_app_password
        }
    });

    // set mail details
    let mailParams = {
        from: "<my-email>@gmail.com",
        to: "<user-email>@gmail.com",
        subject: "Your Daily Spam!",
        test: "We've been trying to reach you about your car's extended warrenty"
    }

    // send the mail and confirm
    mailTransporter.sendMail(mailParams, function (err, data) {
        if(err) {
            console.log("error sending mail - ", err.message);
        } else {
            console.log("--------------------------");
            console.log(`email successfully sent to ${target_email}`);
        }
    })
});

