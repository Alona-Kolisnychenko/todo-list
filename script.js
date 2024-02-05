const list = document.getElementById('list');
const closeFrom = document.getElementById('close-task-form');
const formWrapper = document.getElementById('form-wrapper');
const taskForm = document.getElementById('task-form');
const openFormBtn = document.getElementById('open-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const urgencyBox = document.getElementById('urgency-box');
const taskTitle = document.getElementById('task-title');
const urgency = document.getElementById('urgency');

const taskData = JSON.parse(localStorage.getItem("data")) || [];

const updateTaskList = ()=>{
    addOrUpdateTaskBtn.innerText = "Add Task";

    const now = new Date();
    let day = now.getDate(); 
    let month = now.getMonth()+1;

    day<10? day = '0'+day : day;
    month<10? month = '0'+month : month;

    list.innerHTML = '';

    taskData.forEach(({id, title, urgency, completed})=>{
        (list.innerHTML += `
            <div class="task ${urgency?"bg-important": ""} ${completed?"bg-completed": ""}" id="${id}">
                <p class="date">${day}.${month}</p>
                <div class="checkbox done ${completed?"completed": ""}" title="Check if task is completed">
                    <input type="checkbox" class="checkbox-done" checked="${completed}">
                </div>
                <p class="task-title">${title}</p>
                <div class="checkbox priority ${urgency?"important": ""}" title="Check if task is high priority">
                    <input type="checkbox" class="checkbox-priority" checked="${urgency}">
                </div>
                <button type="button" class="task-btn edit" onclick="editTask(this)">Edit</button>
                <button type="button" class="task-btn delete" onclick="deleteTask(this)">Delete</button>
            </div>
        `)
    })
}

if(localStorage.getItem("data")) updateTaskList();
let currentTask = {};

const addOrUpdateTask = ()=>{
    const date = new Date()
    const task = {
        id: date.getTime(),
        title: taskTitle.value,
        urgency: urgency.checked,
        completed: false
    }
    const checkIndex = taskData.findIndex(item => item.id === currentTask.id);
    if(checkIndex === -1){
        taskData.unshift(task);
    } else{
        taskData[checkIndex] = task;
    }
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskList();
    resetForm();
}



const deleteTask = (buttonEl) => {
    const index = taskData.findIndex(
      (item) => Number(item.id) === Number(buttonEl.parentElement.id)
    );
    taskData.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskList();
}

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
      (item) => item.id == buttonEl.parentElement.id
    );
    currentTask = taskData[dataArrIndex];
    taskTitle.value = currentTask.title;
    urgency.checked = currentTask.urgency;
    addOrUpdateTaskBtn.innerText = "Update Task";
    formWrapper.classList.toggle("hidden");  
}

const resetForm = ()=>{
    taskTitle.value = "";
    urgency.checked = false;
    formWrapper.classList.toggle("hidden");
    currentTask = {};
 }

openFormBtn.addEventListener('click', () => {
  formWrapper.classList.toggle('hidden');
});


closeFrom.addEventListener('click', () => {
  formWrapper.classList.toggle('hidden');
});


taskForm.addEventListener('submit', (event) => {
    event.preventDefault()
    addOrUpdateTask()
});

urgencyBox.addEventListener('click', () => {
  urgency.checked = !urgency.checked;
  urgency.checked? urgencyBox.classList.add('urgent') : urgencyBox.classList.remove('urgent')
});

list.addEventListener('click', (e) => {
  if (e.target.className.includes('done')) {
    const index = taskData.findIndex(item=>Number(item.id) === Number(e.target.parentElement.id))
    taskData[index].completed = !taskData[index].completed;
  } else if (e.target.className.includes('priority')) {
    const index = taskData.findIndex(item=>Number(item.id) === Number(e.target.parentElement.id))
    taskData[index].urgency = !taskData[index].urgency;
  }
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskList();
});
