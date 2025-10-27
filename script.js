// Функция для установки текущей даты
function setCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateString = now.toLocaleDateString('la-Latn', options); // Латинская дата для стиля
    document.getElementById('currentDate').textContent = dateString;
}

// Функция для добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Inscribe aliquid!'); // "Напиши что-нибудь!" на латыни
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
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete';
    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        if (confirm('Delete this entry?')) {
            li.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                li.remove();
                saveTasks();
                updateTaskNumbers();
            }, 300);
        }
    };

    // Собираем всё вместе
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Анимация появления
    li.style.animation = 'fadeIn 0.5s ease';

    // Очищаем поле ввода
    taskInput.value = '';

    // Добавляем обработчик клика для перечеркивания
    li.addEventListener('click', function(e) {
        if (e.target !== deleteBtn) {
            this.classList.toggle('completed');
            saveTasks();
        }
    });

    // Сохраняем задачи
    saveTasks();
    updateTaskNumbers();
}

// Функция для обновления нумерации
function updateTaskNumbers() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach((task, index) => {
        // CSS counter автоматически обновит нумерацию
    });
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
    localStorage.setItem('gothicNotebook', JSON.stringify(tasks));
}

// Функция для загрузки списка при старте приложения
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('gothicNotebook')) || [];
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
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = function(event) {
            event.stopPropagation();
            if (confirm('Delete this entry?')) {
                li.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    li.remove();
                    saveTasks();
                    updateTaskNumbers();
                }, 300);
            }
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);

        li.addEventListener('click', function(e) {
            if (e.target !== deleteBtn) {
                this.classList.toggle('completed');
                saveTasks();
            }
        });

        taskList.appendChild(li);
    });
    
    updateTaskNumbers();
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// Загружаем задачи при загрузке страницы
window.onload = function() {
    setCurrentDate();
    loadTasks();
    
    // Чтобы задача добавлялась по нажатию Enter
    document.getElementById('taskInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
};