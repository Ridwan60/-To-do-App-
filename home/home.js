const token = localStorage.getItem('token');

document.getElementById("Logout").addEventListener("click", () => {
  window.location.href = "../login/login.html";
});

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = document.createElement("li");
  newTask.className = "task";
  newTask.id = Date.now();
  newTask.innerHTML = `
      <div class="task-text">${taskInput.value}</div>
      <button onclick="deleteTask(this)">Delete</button>
    `;
  taskList.appendChild(newTask);

  //console.log(taskInput.value);
  addTaskToDb(newTask.id, taskInput.value);

  taskInput.value = "";
}

function addTaskToDb(id, content) {
  const body = {
    username: localStorage.getItem('username'),
    id: id,
    content: content
  };

  fetch('http://localhost:1234/addNewList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
    .then(data => {
      if (data) {
        console.log("added task")
      }
      else {
        alert('Database error')
      }
    })
    .catch(error => {
      console.error('Error : ', error);
      alert("Server error")
    });
}

function loadFromDB() {
  const id = {
    username: localStorage.getItem('username')
  };

  fetch('http://localhost:1234/getAllLists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(id)
  }).then(response => response.json())
    .then(data => {
      if (data) {
        data.forEach((element) => {
          const newTask = document.createElement("li");
          newTask.className = "task";
          newTask.id = element.id;
          newTask.innerHTML = `
      <div class="task-text">${element.content}</div>
      <button onclick="deleteTask(this)">Delete</button>
    `;
          taskList.appendChild(newTask);
        })
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

// Function to delete a task
function deleteTask(button) {
  const taskList = document.getElementById("taskList");
  const taskItem = button.parentElement;
  //console.log(taskItem.id);
  deleteTaskfromDB(taskItem.id);
  taskList.removeChild(taskItem);
}

function deleteTaskfromDB(id){
  const body = {
    username: localStorage.getItem('username'),
    id: id
  };

  fetch('http://localhost:1234/deleteListElement', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(body)
  }).then(response => response.json())
    .then(data => {
      if (data) {
      }
      else {
        alert('Database Error')
      }
    })
    .catch(error => {
      console.error('Error : ', error);
      alert("Server error")
    });
}

// Function to clear all tasks
function clearAllTasks() {
  const taskList = document.getElementById("taskList");

  // Show confirmation dialog box
  const isConfirmed = confirm("Are you sure you want to delete all tasks?");
  if (isConfirmed) {
    clearAllTasksFromDb();
    taskList.innerHTML = "";
  }
}

function clearAllTasksFromDb(){
  const id = {
    username: localStorage.getItem('username')
  };

  fetch('http://localhost:1234/deleteAllElements', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(id)
  }).then(response => response.json())
    .then(data => {
      if (data) {        
      }
      else {
        alert('Database Error')
      }
    })
    .catch(error => {
      console.error('Error : ', error);
      alert("Server error")
    });
}

// Function to show the confirmation dialog
function showConfirmationDialog() {
  const confirmationDialog = document.getElementById("confirmationDialog");
  confirmationDialog.style.display = "block";
}

// Function to hide the confirmation dialog
function hideConfirmationDialog() {
  const confirmationDialog = document.getElementById("confirmationDialog");
  confirmationDialog.style.display = "none";
}

// Event listener for the "Add" button
const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", addTask);

// Event listener for pressing Enter in the task input field
const taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Event listener for the "Delete" buttons in tasks
const deleteButtons = document.querySelectorAll(".task button");
deleteButtons.forEach(button => {
  button.addEventListener("click", function () {
    deleteTask(this);
  });
});

// Event listener for the "Clear All Tasks" button to show the confirmation dialog
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", showConfirmationDialog);

// Event listener for the "Yes" button in the confirmation dialog
const btnConfirm = document.getElementById("btnConfirm");
btnConfirm.addEventListener("click", function () {
  clearAllTasks();
  hideConfirmationDialog();
});

// Event listener for the "No" button in the confirmation dialog
const btnCancel = document.getElementById("btnCancel");
btnCancel.addEventListener("click", hideConfirmationDialog);

loadFromDB();