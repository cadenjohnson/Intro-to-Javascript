
const logger = require('./logger');

exports.getEmails = async function(db) {
    let { data: recipe_users, error } = await db
        .from('recipe_users')
        .select('email')
    if(error){
        logger.error(`Error retrieving emails - ${error}`);
    } else{
        let emailArray = []
        recipe_users.forEach(function (email, i, array) {
            emailArray.push(email.email)
        })
        return emailArray;
    }
}

exports.getAlldata = async function(db) {
    let { data: recipe_users, error } = await db
        .from('recipe_users')
        .select('*')
    if(error){
        logger.error(`Error retrieving all data - ${error}`);
    } else{
        return recipe_users;
    }
}

exports.getID = async function(db, email) {
    let { data: recipe_users, error } = await db
        .from('recipe_users')
        .select('id')
        .eq('email', email)
    if(error){
        logger.error(`Error retrieving id - ${error}`);
    } else{
        return recipe_users[0];
    }
}

exports.insertItems = async function(db, name, email) {
    let { error } = await db
        .from('recipe_users')
        .insert({name:name, email:email})
    
    if(error) {
        logger.error(`Error inserting user - ${name} - ${email}`);
    }
}

exports.removeAcct = async function(db, id) {
    let { error } = await db
        .from('recipe_users')
        .delete()
        .eq('id', id)
    
    if(error) {
        logger.error(`Error deleting user - ${id}`);
    }
}

/* database functions for sqlite3 used in dev
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
*/
