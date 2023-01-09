
const emailValidator = require('deep-email-validator');

module.exports = async function validateEmail(email) {
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
