
const logger = require('./utils/logger');
const sqlite3 = require('sqlite3').verbose();


async function getEmails() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT email FROM users`, [], (err, row) => {
            if(err) {
                logger.error(`Error retrieving emails - ${err}`);
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


async function getAlldata() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if(err) {
                logger.error(`Error retrieving all data - ${err}`);
                reject(err);
            }
            resolve(rows);
        });
    })
}


async function getID(email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM users WHERE email = ?`, email, (err, row) => {
            if(err) {
                logger.error(`Error querying database for id - ${err}`);
                reject(err);
            }
            resolve(row);
        });
    })
}


function insertItems(name, email) {
    db.run(`INSERT INTO users(name, email) VALUES (?,?)`,[name, email]);
}