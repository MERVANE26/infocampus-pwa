class SyncManager {
  constructor() {
    this.init();
  }

  init() {
    // Écouter les changements de connexion
    window.addEventListener('online', () => this.syncAll());
    
    // Synchroniser au démarrage si en ligne
    if (navigator.onLine) {
      this.syncAll();
    }
  }

  // Sauvegarder une action hors ligne
  saveAction(type, data) {
    const queue = JSON.parse(localStorage.getItem('syncQueue')) || [];
    queue.push({
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('syncQueue', JSON.stringify(queue));
    
    // Notification
    this.showNotification('📱 Action sauvegardée en local');
  }

  // Synchroniser toutes les actions
  async syncAll() {
    const queue = JSON.parse(localStorage.getItem('syncQueue')) || [];
    if (queue.length === 0) return;

    console.log(`🔄 Synchronisation de ${queue.length} action(s)...`);
    
    for (const action of queue) {
      try {
        await this.processAction(action);
        this.removeAction(action.id);
      } catch (error) {
        console.error('❌ Erreur synchro:', action, error);
      }
    }

    this.showNotification(`✅ ${queue.length} action(s) synchronisée(s)`);
  }

  // Traiter une action
  async processAction(action) {
    switch(action.type) {
      case 'PUBLICATION':
        return await this.syncPublication(action.data);
      case 'REACTION':
        return await this.syncReaction(action.data);
      case 'COMMENT':
        return await this.syncComment(action.data);
      default:
        throw new Error('Type d\'action inconnu');
    }
  }

  // Synchroniser une publication
  async syncPublication(data) {
    const response = await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur publication');
  }

  // Synchroniser une réaction
  async syncReaction(data) {
    const response = await fetch(`/api/publications/${data.publicationId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction: data.reaction })
    });
    if (!response.ok) throw new Error('Erreur réaction');
  }

  // Synchroniser un commentaire
  async syncComment(data) {
    const response = await fetch(`/api/publications/${data.publicationId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: data.text })
    });
    if (!response.ok) throw new Error('Erreur commentaire');
  }

  // Supprimer une action de la file
  removeAction(actionId) {
    const queue = JSON.parse(localStorage.getItem('syncQueue')) || [];
    const newQueue = queue.filter(a => a.id !== actionId);
    localStorage.setItem('syncQueue', JSON.stringify(newQueue));
  }

  // Afficher une notification
  showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('INFOCAMPUS', { body: message });
    }
    console.log(message);
  }

  // Obtenir le nombre d'actions en attente
  getPendingCount() {
    const queue = JSON.parse(localStorage.getItem('syncQueue')) || [];
    return queue.length;
  }
}

export default new SyncManager();