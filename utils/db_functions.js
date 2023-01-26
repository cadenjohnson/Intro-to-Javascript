
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

exports.getQuantity = async function(db) {
    let { data, count, error } = await db
        .from('recipe_users')
        .select('*', { count: 'exact' })
    console.log(data);
    if(error){
        logger.error(`Error retrieving id - ${error}`);
    } else{
        return count;
    }
}