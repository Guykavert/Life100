// Функция для установки текущей даты
function setCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateString = now.toLocaleDateString('ru-RU', options);
    document.getElementById('currentDate').textContent = dateString;
}

// Функция для добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Пожалуйста, впишите задачу!');
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
    deleteBtn.title = 'Удалить';
    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        if (confirm('Удалить эту запись?')) {
            li.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 300);
        }
    };

    // Собираем всё вместе
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Анимация появления
    li.style.animation = 'fadeIn 0.4s ease';

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
        deleteBtn.title = 'Удалить';
        deleteBtn.onclick = function(event) {
            event.stopPropagation();
            if (confirm('Удалить эту запись?')) {
                li.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    li.remove();
                    saveTasks();
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
}

// PWA Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(registration) {
        console.log('✅ ServiceWorker зарегистрирован успешно:', registration.scope);
      })
      .catch(function(error) {
        console.log('❌ Ошибка регистрации ServiceWorker:', error);
      });
  });
}

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
    
    // Показываем сообщение об установке PWA
    setTimeout(() => {
        if (window.matchMedia('(display-mode: browser)').matches) {
            console.log('💡 Подсказка: Добавьте приложение на главный экран для лучшего опыта!');
        }
    }, 3000);
};