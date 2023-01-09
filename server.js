
const HOST = "127.0.0.1"; // need way to simplify for prod and implement on client js
const PORT = process.env.PORT || 3500;

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const cron = require("node-cron");
const cred = require("./credentials.json");
const get_content = require("./utils/get_content");
const send_mail = require("./utils/send_mail");
const validate_email = require("./utils/validate_email");

const app = express();

// limits size
app.use(express.json({ limit: '1mb' }));
// middleware to provide response for static and "other" requests
app.use(express.static(path.join(__dirname, '/public')));


// Init database & check if db file exists
if(!fs.existsSync('./users.db')) {
    // if not, create
    fs.writeFile('./users.db', '', (error) => {
        if(error != null) {
            logger.error(error);
        }
    });
}

// connect to db
const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (error) => {
    if(error) {
        logger.error(`Error creating new database - ${error}`);
    }
})

// create table if necessary
db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name, email)`);


// database functions (need to be called asynchronously and awaited)
async function getEmails() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT email FROM users`, [], (err, row) => {
            if(err) {
                logger.error(`Error querying database - ${err}`);
                reject(err);
            }
            let emailArray = []
            row.forEach(function (email, i, array) {
                emailArray.push(email.email)
            })
            resolve(emailArray);
        })
    })
}


async function getDBdata() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if(err) {
                logger.error(`Error retrieving data - ${err}`);
                reject(err);
            }
            resolve(rows);
        });
    })
}


function insertItems(name, email) {
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
    let validcheck = await validate_email(email);
    if(validcheck === true) {
        db.get(`SELECT id FROM users WHERE email = ?`, email, (err, row) => {
            if(err) {
                logger.error(`Error querying database - ${err}`);
            }
            if(row == undefined) {
                insertItems(name, email);
                logger.info(`${name} added to database`);
            } else {
                // notify invalid email
                res.sendStatus(400);
            }
        });
        // respond with confirmation
        res.sendStatus(200);
    } else {
        // notify invalid email
        res.sendStatus(400);
    }
})


// temp admin portal
app.get('/adminpleaseonlytheadmin', async (req, res) => {
    // display entire database
    res.send(await getDBdata());
})


app.post('/adminpleaseonlytheadmin', async (req, res) => {
    res.redirect(301, '/newpage');
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



// establish timing schedule
// * second(optional) * minute * hour * DOM * month * DOW
// * every interval
// X,Y allows multiple values
// X-Y allows range of values
// */X every of that value
// (*) * * * * *
cron.schedule("*/1 * * * *", async function () {
    let emails = await getEmails();
    if(emails.length > 0) {
        let content = await get_content();
        //send_mail(cred.mailer_email, emails, content[0], content[1]);
        logger.info(`${emails.length} emails successfully sent`);
    } else {
        logger.warn("No active users");
    }
});


app.listen(PORT, () => console.log(`Server is listening at ${HOST} on port ${PORT}`));
