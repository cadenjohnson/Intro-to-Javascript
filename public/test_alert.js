
const Form = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');

Form.addEventListener('submit', onSubmit);

// function for sending data to server
async function sendFormData(name, email){
    let params = JSON.stringify({'name': name, 'email': email});
    console.log(params);
    let response = await fetch('http://localhost:3500/newuser', {
        method: 'POST',
        headers: {
            "Content-Type":  'application/json'
        },
        body: params
    })
    .then((response) => response)

    // provide confirmation
    if(response.status === 200) {
        msg.classList.add('success');
        msg.innerHTML = 'Thanks for joining!';
        setTimeout(() => msg.remove(), 3000);
    } else {
        console.error('Error submitting form data');
    }
}


// function for event listener
function onSubmit(e) {
    e.preventDefault();
    if(nameInput.value === '' || emailInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Both fields must be filled out';
        setTimeout(() => msg.remove(), 3000);
    } else {
        console.log(nameInput.value, emailInput.value);
        // validate email address

        // send back to server to update DB
        sendFormData(nameInput.value, emailInput.value);
        nameInput.value = '';
        emailInput.value = '';
    }
}
