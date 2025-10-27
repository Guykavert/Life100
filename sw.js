const CACHE_NAME = 'gothic-notebook-v3.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './sw.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event) {
  console.log('🔄 Установка Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ Кешируем файлы для оффлайн работы');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ Все файлы закешированы');
        return self.skipWaiting();
      })
  );
});

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

self.addEventListener('fetch', function(event) {
  // Пропускаем не-GET запросы и chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем кешированную версию или загружаем из сети
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // Клонируем ответ для кеширования
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(function() {
        // Fallback для оффлайн режима
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        return new Response('Оффлайн режим');
      })
  );
});