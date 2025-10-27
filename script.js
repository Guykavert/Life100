// === НАЧАЛО ДОБАВЛЕННОГО КОДА ===
// Проверка URL и перенаправление при необходимости
if (window.location.pathname !== '/Life100/' && window.location.pathname !== '/Life100/index.html') {
  console.log('🔄 Исправляем URL...');
  window.history.replaceState({}, '', './');
}

// Проверка загрузки всех ресурсов
window.addEventListener('load', function() {
  console.log('📦 Проверка ресурсов:');
  const resources = [
    './index.html',
    './style.css', 
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
  ];
  
  resources.forEach(function(resource) {
    fetch(resource)
      .then(response => {
        console.log('✅ ' + resource + ' - ' + response.status);
      })
      .catch(error => {
        console.log('❌ ' + resource + ' - Ошибка: ' + error);
      });
  });
});

// СИЛЬНЫЙ ФИКС ПЕРЕНОСА ТЕКСТА
function forceTextWrap() {
    const taskTexts = document.querySelectorAll('.task-text');
    
    taskTexts.forEach(text => {
        // Принудительно разбиваем длинные слова
        let content = text.textContent;
        let wrappedContent = content.replace(/([^\s]{15})/g, '$1 ');
        text.textContent = wrappedContent;
        
        // Принудительные стили
        text.style.wordBreak = 'break-all';
        text.style.overflowWrap = 'break-word';
        text.style.whiteSpace = 'normal';
    });
}
// === КОНЕЦ ДОБАВЛЕННОГО КОДА ===

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
                forceTextWrap(); // Обновляем после удаления
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
    
    // Применяем фикс переноса
    setTimeout(forceTextWrap, 50);
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
                    forceTextWrap(); // Обновляем после удаления
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
    
    // Применяем фикс переноса для загруженных задач
    setTimeout(forceTextWrap, 100);
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

// Улучшения для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
    // Предотвращение двойного тапа для масштабирования
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Улучшение фокуса на поле ввода
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('focus', function() {
        setTimeout(() => {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
});

// PWA Installation
let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installButton) {
        installButton.style.display = 'block';
    }
});

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил PWA');
            }
            deferredPrompt = null;
            if (installButton) {
                installButton.style.display = 'none';
            }
        });
    }
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
    
    // Финальное применение фикса переноса
    setTimeout(forceTextWrap, 500);
};