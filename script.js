// Функция для добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Пожалуйста, введите задачу!');
        return;
    }

    const taskList = document.getElementById('taskList');

    // Создаем элемент списка
    const li = document.createElement('li');
    li.className = 'task-item';

    // Создаем элемент для текста задачи
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;

    // Создаем кнопку удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // Предотвращаем срабатывание клика по всей задаче
        li.remove();
        saveTasks(); // Сохраняем список после удаления
    };

    // Собираем всё вместе
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Очищаем поле ввода
    taskInput.value = '';

    // Добавляем обработчик клика для перечеркивания
    li.addEventListener('click', function() {
        this.classList.toggle('completed');
        saveTasks(); // Сохраняем состояние
    });

    // Сохраняем задачи в локальное хранилище
    saveTasks();
}

// Функция для сохранения списка в LocalStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList .task-item').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('myBookList', JSON.stringify(tasks));
}

// Функция для загрузки списка при старте приложения
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('myBookList')) || [];
    const taskList = document.getElementById('taskList');

    savedTasks.forEach(taskData => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (taskData.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskData.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function(event) {
            event.stopPropagation();
            li.remove();
            saveTasks();
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);

        li.addEventListener('click', function() {
            this.classList.toggle('completed');
            saveTasks();
        });

        taskList.appendChild(li);
    });
}

// Загружаем задачи при загрузке страницы
window.onload = loadTasks;

// Чтобы задача добавлялась по нажатию Enter
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});