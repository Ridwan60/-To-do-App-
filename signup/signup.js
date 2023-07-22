const userNameData = document.getElementById('username');
const passwordData = document.getElementById('password');
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener("submit", function(event) {
    event.preventDefault();
    signup(username.value, password.value);
});

function signup(username, pass) 
{
    const idPass = {
      username: username,
      password: pass
    };  
    
    fetch('http://localhost:1234/signup', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(idPass)
    }).then(response => response.json())
      .then(data => {      
        message = data.message;
        if(message === 'Signed up successfully') {
          window.location.href = "../login/login.html";
        }
        else {
          alert(message)
        }      
      })
      .catch(error => {
        console.error('Error : ', error);
        alert("Server error")
      });
}