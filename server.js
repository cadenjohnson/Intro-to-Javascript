
const HOST = process.env.host_address || "127.0.0.1"; // need way to simplify for prod and implement on client js
const PORT = process.env.PORT || 3500;

const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const cron = require("node-cron");
//const cred = require("./utils/credentials.js");
const send_mail = require("./utils/send_mail");
const validate_email = require("./utils/validate_email");
const db_functions = require("./utils/db_functions");

const temp = require("./utils/credentials");
const cred = temp.get_credentials();

const app = express();

// limits size
app.use(express.json({ limit: '1mb' }));
// middleware to provide response for static and "other" requests
app.use(express.static(path.join(__dirname, '/public')));

/* --> for sqlite3 database solution for dev
const sqlite3 = require('sqlite3').verbose();

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
*/

const { createClient } = require('@supabase/supabase-js');
const db = createClient(
    cred.supabase_url,
    cred.anon_key
);
db.from('recipe_users').insert({name:'test', email:'test@gmail.com'});

// first route for index
app.get('/', (req, res) => {   // can also put '~/$|/index(.html)?' to signify that starts with /, ends w / OR includes the whole shabang or without the file type
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
})


// post route for submitting new users
app.post('/', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let validcheck = await validate_email(email);
    if(validcheck === true) {
        let results = await db_functions.getID(db, email);
        if(results == undefined || results.length === 0) {
            db_functions.insertItems(db, name, email);
            logger.info(`${name} added to database`);
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
})


// route for removing account from database
app.get('/unsubscribe', (req, res) => {
    let acct_id = req.query.id;
    db_functions.removeAcct(db, acct_id);
    logger.info(`Account #${acct_id} removed from database`);
    res.sendFile(path.join(__dirname, 'html', 'unsubscribed.html'));
})


// temp admin portal
app.get('/adminpleaseonlytheadmin', async (req, res) => {
    res.send(await db_functions.getAlldata(db));
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
cron.schedule("0 8 * * 1", async function () {
    let emails = await db_functions.getEmails(db);
    console.log(emails);
    if(emails.length > 0) {
        await send_mail(db, cred.mailer_email, emails);
        logger.info(`${emails.length} emails successfully sent`);
    } else {
        logger.warn("No active users");
    }
});


app.listen(PORT, () => console.log(`Server is listening at ${HOST} on port ${PORT}`));
