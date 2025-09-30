// Define the name of your cache (it's good practice to version this)
const CACHE_NAME = 'cartoon-chess-cache-v1';

// List all the files that need to be saved for offline use
const urlsToCache = [
  './', // Caches the main HTML file at the root path
  '/manifest.json',
  '/icon.png', // This tells the Service Worker to cache your icon picture!
  // All your game logic (CSS/JS) is safely inside the HTML file
];

// 1. Installation: This runs when the browser first visits the page and saves all files.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Pre-caching essential files.');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Error caching some files:', err);
        });
      })
  );
});

// 2. Fetching: This runs every time the browser tries to load a file.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try to find the requested file in the cache first
    caches.match(event.request)
      .then((response) => {
        // If it's in the cache (online or offline), use it!
        if (response) {
          return response;
        }
        // If not, try to fetch it from the network
        return fetch(event.request);
      })
  );
});

// 3. Activation: This cleans up old cache versions if you update the game.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});