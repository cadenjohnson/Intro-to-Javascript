
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { dirname } = require('path');
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
sql = `CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name, email)`;
db.run(sql);

// display entire database
/*
db.all(`SELECT * FROM users`, [], (err, rows) => {
    if(err) {
        console.error('Error creating new database');
    }
    rows.forEach((row) => {
        console.log(row);
    })
});
*/

// first route for index
app.get('/', (req, res) => {   // can also put '~/$|/index(.html)?' to signify that starts with /, ends w / OR includes the whole shabang or without the file type
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
})


// post route for submitting entries
app.post('/newuser', (req, res) => {
    // add new user to DB
    let name = req.body.name
    let email = req.body.email
    db.run(`INSERT INTO users(name, email) VALUES (?,?)`,[name, email]);
    // respond with confirmation
    res.sendStatus(200);
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
    res.status(404).send('that page cannot be found');
})

app.listen(PORT, () => console.log(`Server is listening at localhost on port ${PORT}`));
