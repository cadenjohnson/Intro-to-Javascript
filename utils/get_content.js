
const fs = require('fs');
const logger = require('./logger');

module.exports = async function formulateEmailContent() {
    return new Promise((resolve, reject) => {
        fs.readFile('email_content/email_text.txt', 'utf-8', function(err, data){
            if(err){
                logger.error(`error retrieving email content - ${err}`);
                reject(err);
            } else {
                let subject = '';
                let body = '';
                let lines = data.split('\n');
                lines.forEach(function (line, i, array) {
                    if(i===0) {
                        line = line.replace(/(\r\n|\n|\r)/gm, "");
                        subject = line;
                    } else {
                        if(line.includes("##########")) {
                            line = line.replace("##########", "url to endpoint for account removal");
                            console.log(line);
                        }
                        body+=line;
                    }
                })
                resolve([subject, body]);
            }
        })
    })
}