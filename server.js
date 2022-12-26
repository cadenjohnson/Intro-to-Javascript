
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const emailValidator = require('deep-email-validator');
const { dirname, resolve } = require('path');
const path = require('path');
const PORT = process.env.PORT || 3500;

const app = express();

// limits size
app.use(express.json({ limit: '1mb' }));
// middleware to provide response for static and "other" requests
app.use(express.static(path.join(__dirname, '/public')));


// Init database
// check if db file exists
if(!fs.existsSync('./spam_users.db')) {
    // if not, create
    fs.writeFile('./spam_users.db', '', (error) => {
        if(error != null) {
            console.error(error);
        }
    });
}

// connect to db
const db = new sqlite3.Database('./spam_users.db', sqlite3.OPEN_READWRITE, (error) => {
    if(error) {
        console.error('Error creating new database');
    }
})

// create table if necessary
db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name, email)`);



async function validateEmail(email) {
    const {valid, reason, validators} =  await emailValidator.validate(email);
    let regex = validators.regex.valid
    let typo =  validators.typo.valid
    let dispo = validators.disposable.valid
    let mx = validators.mx.valid

    if(regex===true && typo===true && dispo===true && mx===true) {
        return true;
    } else {
        return false;
    }
}


// database functions (need to be called asynchronously and awaited)
async function getEmails() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT email FROM users`, [], (err, row) => {
            if(err) {
                console.log('Error querying database');
                reject(err);
            }
            resolve(row);
        })
    })
}


async function getAll() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if(err) {
                console.log('Error querying database');
                reject(err);
            }
            resolve(rows);
            console.log("func results = ", rows);
        })
    })
}


async function insertItems(name, email) {
    db.run(`INSERT INTO users(name, email) VALUES (?,?)`,[name, email]);
}


// first route for index
app.get('/', (req, res) => {   // can also put '~/$|/index(.html)?' to signify that starts with /, ends w / OR includes the whole shabang or without the file type
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
})


// post route for submitting entries
// must post to origin to prevent CORS errors
app.post('/', async (req, res) => {
    // add new user to DB
    let name = req.body.name;
    let email = req.body.email;
    let validcheck = await validateEmail(email);
    if(validcheck === true) {
        db.get(`SELECT id FROM users WHERE email = ?`, email, (err, row) => {
            if(err) {
                console.error('Error querying database');
            }
            if(row == undefined) {
                db.run(`INSERT INTO users(name, email) VALUES (?,?)`,[name, email]);
                console.log(`${name} added to database`);
            } else {
                console.warn('Email is already in DB');
            }
        });
        // respond with confirmation
        res.sendStatus(200);
    } else {
        console.log("error: invalid email address");
        res.sendStatus(400);
    }
})


// temp admin portal
app.get('/adminpleaseonlytheadmin', (req, res) => {
    // display entire database
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if(err) {
            console.error('Error creating new database');
            res.redirect(301, '/errorpage');
        }
        rows.forEach((row) => {
            console.log(row);
        })
        res.send(rows);
    });
})


// test portfolio site
app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'portfolio.html'));
})


// example routes
app.get('/newpage', (req, res) => {
    res.send('new page, wassup');
})

app.get('/oldpage', (req, res) => {
    res.redirect(301, '/newpage'); // 302 by default, need 301 for permenant redirect
})


// covers all other get requests
app.get('/*', (req, res) => {
    res.status(404).send("There's been an error");
})



//*********************************************************
//code for email feature
//*********************************************************
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const cred = require("./credentials.json");


function sendMail(source, target) {
    // set server mail service
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: cred.mailer_email,
            pass: cred.mailer_app_password
        }
    });
    // set mail details
    let mailParams = {
        from: source,
        to: target,
        subject: "Your Daily Spam!",
        text: "We've been trying to reach you about your car's extended warrenty"
    }
    // send the mail and confirm
    mailTransporter.sendMail(mailParams, function (err, data) {
        if(err) {
            console.log("error sending mail - ", err.message);
        } else {
            console.log("--------------------------");
            console.log(`email successfully sent to ${target}`);
        }
    })
}


async function execute_operation_mailman() {
    temp = await getEmails();
    //sendMail(cred.mailer_email, cred.mailer_email);
    app.listen(PORT, () => console.log(`Server is listening at localhost on port ${PORT}`));
}


// establish timing schedule
// * second(optional) * minute * hour * DOM * month * DOW
// * every interval
// X,Y allows multiple values
// X-Y allows range of values
// */X every of that value
// (*) * * * * *
cron.schedule("1 * * * *", function () {
    console.log("hello world");
});
//*********************************************************


execute_operation_mailman();
