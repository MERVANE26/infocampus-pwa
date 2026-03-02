import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';

// ============================================
// ENREGISTREMENT DU SERVICE WORKER (PWA)
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker enregistré avec succès!');
        console.log('📌 Scope:', registration.scope);
        
        // Demander la permission pour les notifications
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              console.log('✅ Notifications autorisées');
            }
          });
        }
      })
      .catch(error => {
        console.log('❌ Erreur Service Worker:', error);
      });
  });

  // Écouter les messages du Service Worker
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('📨 Message du Service Worker:', event.data);
    
    // Gérer différents types de messages
    if (event.data.type === 'SYNC_COMPLETE') {
      console.log('✅ Synchronisation terminée');
    } else if (event.data.type === 'NEW_CONTENT') {
      console.log('📢 Nouveau contenu disponible');
    }
  });
}

// ============================================
// CRÉATION DE LA RACINE REACT
// ============================================
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu de l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);