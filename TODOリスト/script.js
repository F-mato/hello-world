function updateDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var datetime = year + "年" + month + "月" + day + "日 " + hour + "時" + minute + "分" + second + "秒";
    document.getElementById("datetime").innerHTML = datetime;
}
setInterval(updateDateTime, 1000);

function saveTasksToSession() {
    const tasks = document.querySelectorAll('#tasksList li');
    const tasksData = [];
    tasks.forEach(task => {
        const textContent = task.firstChild.nextSibling.textContent;
        const isChecked = task.firstChild.checked;
        tasksData.push({ text: textContent, isChecked });
    });
    sessionStorage.setItem('tasks', JSON.stringify(tasksData));
}

function loadTasksFromSession() {
    const tasksData = JSON.parse(sessionStorage.getItem('tasks'));
    if (tasksData) {
        tasksData.forEach(task => {
            addTaskToList(task.text, task.isChecked);
        });
    }
}

function addTaskToList(taskText, isChecked = false) {
    const tasksList = document.getElementById('tasksList');
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.classList.add('task-checkbox');
    checkbox.onchange = saveTasksToSession;

    const textNode = document.createTextNode(` ${taskText}`);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '消去';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function() {
        tasksList.removeChild(li);
        saveTasksToSession();
    };

    li.appendChild(checkbox);
    li.appendChild(textNode);
    li.appendChild(deleteBtn);
    tasksList.appendChild(li);
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    if (taskInput.value.trim() !== '' && taskDate.value !== '' && taskTime.value !== '') {
        const taskText = `${taskInput.value} - ${taskDate.value} ${taskTime.value}`;
        addTaskToList(taskText);
        saveTasksToSession();
        taskInput.value = '';
        taskDate.value = '';
        taskTime.value = '';
    } else {
        alert('Please fill in all fields!');
    }
}


document.getElementById('saveToDatabase').addEventListener('click', function() {
    const tasksData = JSON.parse(sessionStorage.getItem('tasks')) || [];
    tasksData.forEach(task => {
        insertTaskToDatabase(task);
    });
});

function insertTaskToDatabase(task) {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    })
    .then(response => {
        if (response.ok) {
            console.log('Task inserted successfully');
            // 必要に応じてUIを更新
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteTaskFromDatabase(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Task deleted successfully');
            // 必要に応じてUIを更新
        }
    })
    .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', loadTasksFromSession);

