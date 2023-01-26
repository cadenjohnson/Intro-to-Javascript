
const HOST = process.env.host_address || "127.0.0.1"; // need way to simplify for prod and implement on client js
const PORT = process.env.PORT || 3500;

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const cron = require("node-cron");
const send_mail = require("./utils/send_mail");
const validate_email = require("./utils/validate_email");
const db_functions = require("./utils/db_functions");
var session = require('express-session');
const get_content = require('./utils/get_content');

const temp = require("./utils/credentials");
const cred = temp.get_credentials();

const app = express();

// limits size
app.use(express.json({ limit: '1mb' }));
app.use(express.text({ limit: '1mb' }));
// middleware to provide response for static and "other" requests
app.use(express.static(path.join(__dirname, '/public')));
// sets up session for logging in as admin
app.use(session({secret: cred.secret, resave: false, saveUninitialized: true}));
// for parsing the body of requests
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// Configure and connect to database
const { createClient } = require('@supabase/supabase-js');
const db = createClient(
    cred.supabase_url,
    cred.anon_key
);



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


// admin portal routes
app.get('/adminlogin', async (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'adminlogin.html'));
})

app.post('/adminlogin', async (req, res) => {
    if(req.body.username === cred.username && req.body.password === cred.password) {
        session = req.session;
        session.user = req.body.username;
        res.redirect('/admin');
    } else {
        res.sendStatus(400);
    }
})

app.get('/admin', async (req, res) => {
    if(!req.session.user) {
        res.status(401).send("Invalid Login Attempt");
    } else {
        res.sendFile(path.join(__dirname, 'html', 'admin.html'));
    }
})

app.get('/logout', (req, res) => {
    if(!req.session.user) {
        res.status(401).send("Invalid Login Attempt");
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})

app.get('/getemails', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
    } else {
        let temp = await db_functions.getEmails(db);
        temp = temp.slice(0,10);
        res.send(JSON.stringify(temp));
    }
})

app.get('/getemailcontent', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
    } else {
        let temp = await get_content.getContent();
        res.send(temp);
    }
})

app.post('/getemailcontent', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/');
    } else {
        // update email_content file
        let new_content = req.body.content;
        fs.writeFileSync('./email_content/email_text.txt', new_content, 'utf-8');
        // respond with 200
        res.sendStatus(200);
    }
})

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
