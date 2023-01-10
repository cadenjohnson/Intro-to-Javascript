
const ORIGIN = 'https://seaview-app-zcioy.ondigitalocean.app/' 

const Form = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');

Form.addEventListener('submit', onSubmit);

// function for sending data to server
async function sendFormData(name, email){
    let params = JSON.stringify({'name': name, 'email': email});
    let response = await fetch(ORIGIN, {
        method: 'POST',
        headers: {"Content-Type":  'application/json'},
        body: params
    })
    .then((response) => response)

    // provide confirmation
    if(response.status === 200) {
        msg.classList.add('success');
        msg.innerHTML = 'Thanks for joining!';
        setTimeout(() => {
            msg.innerHTML = '';
            msg.classList.remove('success');
        }, 3000);
    } else if(response.status === 400){
        msg.classList.add('error');
        msg.innerHTML = 'Invalid Email. Try Again';
        setTimeout(() => {
            msg.innerHTML = '';
            msg.classList.remove('error');
        }, 3000)
    } else {
        msg.classList.add('error');
        msg.innerHTML = 'Error submitting information';
        setTimeout(() => {
            msg.innerHTML = '';
            msg.classList.remove('error');
        }, 3000)
    }
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
