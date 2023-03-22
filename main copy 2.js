const $toDoList = document.getElementById('to-do-list');
const $form = document.getElementById('input-form');
const $urgency = document.getElementById('urgency');
const $task = document.getElementById('task');
const $date = document.getElementById('date');
const $option = document.getElementsByTagName('option');
const $completedTaskCount = document.getElementById('total-tasks-completed');
const $totalTaskCount = document.getElementById('total-tasks');
const $dateAlertBox = document.getElementById('dateAlertBox');
const $alertBoxBtn = document.getElementById('alertBoxBtn');
const $backBox = document.getElementById('backBox');

let completedTasksCount = JSON.parse(localStorage.getItem("completedTasks")) ?? 0;
let totalTasks = JSON.parse(localStorage.getItem("totalTasks")) ?? 0;

/*

eventListeners

*/

document.addEventListener("DOMContentLoaded", init)

$form.addEventListener('submit', e => {
    e.preventDefault();
    addTaskListItem();
})

$urgency.addEventListener('change', () => {

    switch ($urgency.value) {
        case 'Low':
            $urgency.className = "green";
            break;
        case 'Medium':
            $urgency.className = "yellow";
            break;
        case 'High':
            $urgency.className = "orange";
            break;
        case 'Highest':
            $urgency.className = "red";
            break;
    }   
})

$toDoList.addEventListener('click', e => {
    if (e.target.matches('img')) {
      if (e.target.classList.contains("done")) {
        $toDoList.removeChild(e.target.parentNode)
        console.log(e.target.parentNode)
        addTotalTaskCompleted();
      }
      if (e.target.classList.contains("edit")) {
        $toDoList.removeChild(e.target.parentNode)
      }
      if (e.target.classList.contains("remove")) {
        $toDoList.removeChild(e.target.parentNode)
        removeTotalTask()
      }
    }
})

$alertBoxBtn.addEventListener('click', () => {
    hideAlert();
})

/*

functions

*/

function init() {
    createTaskListOnStartUp();
    addCompletedAndTotalTaskCount();
}

function createTaskListOnStartUp() {
    let taskList = JSON.parse(localStorage.getItem("Tasks"))

    if (!taskList) return 
    
    for (let i = 0; i < Object.keys(taskList).length; i++ ) {
    
        const listItemContainer = addTaskInfo("list-item");
        listItemContainer.id = Object.keys(taskList)[i]

        let eachTaskList = taskList[Object.keys(taskList)[i]]
        let objectKeys = Object.keys(eachTaskList);
        let objectValues = Object.values(eachTaskList)
    
        objectKeys.forEach( key => {
          switch (key) {
            case "urgency":
                listItemContainer.appendChild(addTaskInfo(`container-item ${objectValues[0]}`, `${objectValues[0]}`))
                break;
            case "task":
                listItemContainer.appendChild(addTaskInfo(`container-item task`, `${objectValues[1]}`));
                break;
            case "due date": 
                listItemContainer.appendChild(addTaskInfo(`container-item`, `${objectValues[2]}`));
                break;
          }})

        listItemContainer.appendChild(addTaskButton('/Images/checked.png', 'icon-image image-left done'));
        listItemContainer.appendChild(addTaskButton('/Images/edit.png', 'icon-image image-middle edit'));
        listItemContainer.appendChild(addTaskButton('/Images/trash-bin.png', 'icon-image image-right remove'));
        $toDoList.appendChild(listItemContainer);
    }
}

function addCompletedAndTotalTaskCount() {
    let completed = JSON.parse(localStorage.getItem("completedTasks"));
    let total = JSON.parse(localStorage.getItem("totalTasks"));

    for (let key in completed) {
        for (let value in completed[key]) {
            completedTasksCount = completed[key][value];
        }
    }

    for (let key in total) {
        for (let value in total[key]) {
            totalTasks = total[key][value];
        }
    }

    $totalTaskCount.innerText = totalTasks;
    $completedTaskCount.innerText = completedTasksCount;
}

function correctDateFormat(date) {
  return date = new Date(date).toLocaleDateString();
}


function storeTotalTasks(total) {
    if (!localStorage) return alert("localStorage is not supported");

    let totalTasks = JSON.parse(localStorage.getItem('totalTasks')) || {};

    localStorage.setItem("totalTasks", JSON.stringify(total));
}

function storeCompletedTaskCount(completed) {
    if (!localStorage) return alert("localStorage is not supported");

    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || {};

    localStorage.setItem("completedTasks", JSON.stringify(completed));
}

function addTaskButton(src, className) {
    const item = document.createElement('img');
    item.src = src;
    item.className = className;

    return item;
}

function isBeforeToday(date) {
    const inputDate = new Date(date);
    const today = new Date();
    
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate == "Invalid Date" || inputDate >= today) {
        return false
    }

    $dateAlertBox.style.visibility = "visible";
    $backBox.style.display = "block";
    return true
}

function addTaskInfo(className, innerText = null) {
    const item = document.createElement('div');
    item.className = className;
    
    if (innerText) item.innerText = innerText;

    return item;
}

function storeTaskItem(task, id) {
    if (!localStorage) return alert("localStorage is not supported");

    let taskList = JSON.parse(localStorage.getItem("Tasks")) || {};

    taskList[id] = task;
    localStorage.setItem("Tasks", JSON.stringify(taskList))  
}

function generateUniqueId() {
    let id;
    let isUniqueId = false;
    let taskList = JSON.parse(localStorage.getItem("Tasks")) || {};

    while (!isUniqueId) {
     
      id = Math.floor(Math.random() * 99999).toString();
      
      isUniqueId = !Object.keys(taskList).some(itemId => itemId === id);
    }
    return id;
}

function addTaskListItem() {

    if (isBeforeToday($date.value)) return
    
    const listItemContainer = addTaskInfo("list-item");
    const ID = generateUniqueId();

    listItemContainer.appendChild(addTaskInfo(`container-item ${$urgency.value}`, $urgency.value));
    listItemContainer.appendChild(addTaskInfo('container-item task', $task.value));
    listItemContainer.appendChild(addTaskInfo('container-item', $date.value ? correctDateFormat($date.value) : '-'));

    listItemContainer.appendChild(addTaskButton('/Images/checked.png', 'icon-image image-left done'));
    listItemContainer.appendChild(addTaskButton('/Images/edit.png', 'icon-image image-middle edit'));
    listItemContainer.appendChild(addTaskButton('/Images/trash-bin.png', 'icon-image image-right remove'));
    listItemContainer.id = ID;
    let taskList = JSON.parse(localStorage.getItem("Tasks"));
   
    $toDoList.appendChild(listItemContainer);

    const taskItem = {
        "urgency": listItemContainer.children[0].innerText,
        "task": listItemContainer.children[1].innerText,
        "due date": listItemContainer.children[2].innerText,
    }

    storeTaskItem(taskItem, ID)
   
    $task.value = "";
    addTotalTask();
}

function addTotalTask() {
    totalTasks++;
    $totalTaskCount.innerText = totalTasks;
    storeTotalTasks(totalTasks);
}

function removeTotalTask() {
    totalTasks--;
    $totalTaskCount.innerText = totalTasks;
    storeTotalTasks(totalTasks);
}

function addTotalTaskCompleted() {
    completedTasksCount++
    $completedTaskCount.innerText = completedTasksCount;
    storeCompletedTaskCount(completedTasksCount)
}

function hideAlert() {
    $dateAlertBox.style.visibility = "hidden";
    $backBox.style.display = "none";
}