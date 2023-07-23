
function handleButtonClick(event) {
    
    event.preventDefault();

    if (event.target.classList.contains('btn-login')) {
        window.location.href = '../login/login.html'; 
    } else if (event.target.classList.contains('btn-signup')) {
        window.location.href = '../signup/signup.html';
    }
}


const loginButton = document.querySelector('.btn-login');
const signupButton = document.querySelector('.btn-signup');

loginButton.addEventListener('click', handleButtonClick);
signupButton.addEventListener('click', handleButtonClick);
