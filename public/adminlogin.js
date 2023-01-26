
const ORIGIN = 'https://seaview-app-zcioy.ondigitalocean.app/' 

const Form = document.querySelector('#my-form');
const nameInput = document.querySelector('#username');
const emailInput = document.querySelector('#password');
const msg = document.querySelector('.msg');

Form.addEventListener('submit', onSubmit);

// function for sending data to server
async function sendFormData(username, password){
    let params = JSON.stringify({'username': username, 'password': password});
    let response = await fetch(ORIGIN+"adminlogin", {
        method: 'POST',
        headers: {"Content-Type":  'application/json'},
        body: params
    })
    .then((response) => {
        // provide confirmation
        if(response.status === 400){
            msg.classList.add('error');
            msg.innerHTML = 'Invalid Credentials. Try Again';
            setTimeout(() => {
                msg.innerHTML = '';
                msg.classList.remove('error');
            }, 3000)
        } else {
            window.location.href = ORIGIN+"admin";
        }
    })
    return response;
}


// function for event listener
function onSubmit(e) {
    e.preventDefault();
    if(nameInput.value === '' || emailInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Both fields must be filled out';
        setTimeout(() => {
            msg.innerHTML = '';
            msg.classList.remove('error');
        }, 3000)
    } else {
        // send to server to validate and update DB
        sendFormData(nameInput.value, emailInput.value);
        nameInput.value = '';
        emailInput.value = '';
    }
}
