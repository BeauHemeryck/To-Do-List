const $toDoList = document.getElementById('to-do-list');
const $backArrow= document.getElementById('backArrow');

document.addEventListener("DOMContentLoaded", createTaskListOnStartUp());

function createTaskListOnStartUp() {
    let taskList = JSON.parse(localStorage.getItem("completedTaskItems"))
    if (!taskList) return 
    
    for (let i = 0; i < Object.keys(taskList).length; i++ ) {
    
        const listItemContainer = addTaskInfo("list-item");
        listItemContainer.id = Object.keys(taskList)[i]

        let eachTaskList = taskList[Object.keys(taskList)[i]]
        let objectKeys = Object.keys(eachTaskList);
        let objectValues = Object.values(eachTaskList)
    
        objectKeys.forEach(key => {
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
        $toDoList.appendChild(listItemContainer);
    }
}

function addTaskInfo(className, innerText = null) {
    const item = document.createElement('div');
    item.className = className;
    
    if (innerText) item.innerText = innerText;

    return item;
}