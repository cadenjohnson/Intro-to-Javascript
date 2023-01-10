
const cred = require("../credentials.json");

exports.mailer_email = function(){
    if(process.env.mailer_email) {
        return process.env.mailer_email;
    } else {
        return cred.mailer_email;
    }
}


exports.mailer_app_password = function(){
    if(process.env.mailer_app_password) {
        return process.env.mailer_app_password;
    } else {
        return cred.mailer_app_password;
    }
}


exports.host_address = function(){
    if(process.env.host_address) {
        return process.host_address;
    } else {
        return cred.host_address;
    }
}