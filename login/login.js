const userNameData = document.getElementById('username');
const passwordData = document.getElementById('password');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();    
    login(username.value, password.value);
});

function login(username, pass) 
{
    const idPass = {
      username: username,
      password: pass
    };  
    
    fetch('http://localhost:1234/login', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(idPass)
    }).then(response => response.json())
      .then(data => {      
        token = data.token;
        if(token) {
          console.log('token that you got : ',token);
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          window.location.href = "../home/home.html";
        }
        else {
          alert('Invalid credentials')
        }      
      })
      .catch(error => {
        console.error('Error : ', error);
        alert("Server error")
      });
}