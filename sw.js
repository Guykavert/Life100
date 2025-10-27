// Готическая Тетрадь - Service Worker
const CACHE_NAME = 'gothic-notebook-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './style.css', 
  './script.js',
  './manifest.json'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
  console.log('🔄 Service Worker устанавливается...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ Кешируем файлы приложения');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ Все файлы закешированы');
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', function(event) {
  console.log('🎯 Service Worker активирован');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаляем старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('✅ Service Worker готов к работе');
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кешированную версию или загружаем из сети
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // Проверяем валидный ли ответ
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(function() {
        // Fallback для оффлайн режима
        return new Response('Оффлайн режим', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});