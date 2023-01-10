
const logger = require('./logger');


exports.getEmails = async function(db) {
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


exports.getAlldata = async function(db) {
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


exports.getID = async function(db, email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM users WHERE email = ?`, email, (err, row) => {
            if(err) {
                logger.error(`Error retrieving id - ${err}`);
                reject(err);
            }
            resolve(row);
        });
    })
}


exports.insertItems = function(db, name, email) {
    db.run(`INSERT INTO users(name, email) VALUES (?,?)`,[name, email]);
}


exports.removeAcct = function(db, id) {
    db.run('DELETE FROM users WHERE id = ?', id);
}
