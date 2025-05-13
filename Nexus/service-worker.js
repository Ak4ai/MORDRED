self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/Singularidade.html',
          '/style.css', // Adicione todos os arquivos necessários para o offline
          '/script.js',
          '/inventario.js',
          '/map.js',
          '/youtube.js',
          '/firebaseconfig.js',
          '/google.js',
          '/chat.js',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  