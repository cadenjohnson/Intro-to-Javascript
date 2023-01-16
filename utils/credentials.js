
exports.get_credentials = function(){
    if(process.env.mailer_email) {
        return process.env;
    } else {
        const cred = require("../credentials.json");
        return cred;
    }
}

