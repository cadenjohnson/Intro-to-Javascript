
const Form = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');

Form.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    if(nameInput.value === '' || emailInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Both fields must be filled out';

        setTimeout(() => msg.remove(), 3000);
    } else {
        console.log('success');
        // validate email address

        // send back to server to update DB

        // provide confirmation
        
    }
}
