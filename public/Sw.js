// public/sw.js - Service Worker avec Workbox

const CACHE_NAME = 'infocampus-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('✅ Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ Erreur cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activé');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Ancien cache supprimé:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Stratégie de cache : Network First puis fallback sur cache
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Stratégie pour les pages HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache la nouvelle page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si hors ligne, retourner la page offline
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Stratégie pour les autres ressources (CSS, JS, images)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retourner depuis le cache
        }
        
        // Sinon, aller sur le réseau
        return fetch(event.request)
          .then(response => {
            // Ne pas mettre en cache les réponses non valides
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Mettre en cache la nouvelle ressource
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });

            return response;
          })
          .catch(error => {
            console.error('❌ Erreur fetch:', error);
            // Pour les images, retourner une image par défaut si disponible
            if (event.request.destination === 'image') {
              return caches.match('/icon-192x192.png');
            }
          });
      })
  );
});

// Gestion des messages (pour la synchronisation)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'sync-publications') {
    event.waitUntil(syncPublications());
  }
});

// Fonction de synchronisation des publications
async function syncPublications() {
  try {
    const db = await openDB();
    const publications = await db.getAll('pendingPublications');
    
    for (const pub of publications) {
      try {
        const response = await fetch('/api/publications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pub)
        });
        
        if (response.ok) {
          await db.delete('pendingPublications', pub.id);
        }
      } catch (error) {
        console.error('❌ Erreur synchronisation:', error);
      }
    }
  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
  }
}

// Fonction utilitaire pour ouvrir IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('infocampus-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingPublications')) {
        db.createObjectStore('pendingPublications', { keyPath: 'id' });
      }
    };
  });
}