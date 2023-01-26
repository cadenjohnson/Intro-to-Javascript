
const ORIGIN = 'https://seaview-app-zcioy.ondigitalocean.app/'
const msg = document.querySelector('.msg');
const emails = document.querySelector('.emails');
const email_content = document.getElementById("email-content");
const FORM = document.querySelector('#content-form');

// get list of user emails
async function getEmails() {
    let response = await fetch(ORIGIN+'getemails', {
        method: 'GET'
    })
    .then((response) => response)
    return response.json()
}

// get email content
async function getEmailContent() {
    let response = await fetch(ORIGIN+'getemailcontent', {
        method: 'GET'
    })
    .then((response) => response)
    return response.text();
}

// update doc elements with data
async function getPageContent() {
    let email_list = await getEmails();
    let content = await getEmailContent();
    email_content.innerHTML = content;

    // add new divs for each email
    let htmlElements = "";
    for (var i=0; i<email_list.length; i++) {
        htmlElements += `<div id="email${i}" class="emailbox">${email_list[i]}</div>`
    }
    emails.innerHTML = htmlElements;
}

FORM.addEventListener('submit', onSubmit);
getPageContent();


// on submit --> update email content
async function onSubmit(e) {
    e.preventDefault();
    //let temp = email_content.value;
    //console.log(temp);
    let params = JSON.stringify({content: email_content.value});
    let response = await fetch(ORIGIN+"getemailcontent", {
        method: 'POST',
        headers: {"Content-Type":  'application/json'},
        body: params
    })
    .then((response) => {
        // provide confirmation
        if(response.status === 200){
            msg.classList.add('success');
            msg.innerHTML = 'Email content updated!';
            setTimeout(() => {
                msg.innerHTML = '';
                msg.classList.remove('success');
            }, 3000)
        } else {
            msg.classList.add('error');
            msg.innerHTML = 'Error updating content...';
            setTimeout(() => {
                msg.innerHTML = '';
                msg.classList.remove('error');
            }, 3000)
        }
    })
}
