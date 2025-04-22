
console.log('Service Worker Loaded');

// Debugging helper
const swLog = (message, data = {}) => {
  const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
  console.log(`[ServiceWorker] ${logMessage}`, data);
};

// Lifecycle events
self.addEventListener('install', event => {
  swLog('Installing Service Worker');
  // Force activation
  self.skipWaiting();
  swLog('Skip waiting called - will activate immediately');
});

self.addEventListener('activate', event => {
  swLog('Service Worker activated');
  // Take control of all clients
  event.waitUntil(
    self.clients.claim()
      .then(() => {
        swLog('Successfully claimed all clients');
        // Notify all clients that the service worker is ready
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              timestamp: new Date().toISOString()
            });
          });
        });
      })
      .catch(err => {
        swLog('Error claiming clients:', err);
      })
  );
});

// Push event handler
self.addEventListener('push', function(event) {
  try {
    swLog('Received push event', event);
    
    // Check if there's data in the push message
    if (!event.data) {
      swLog('No data received in push event');
      return;
    }
    
    const data = event.data.json();
    swLog('Push data parsed', data);
    
    const options = {
      body: data.content,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.metadata || {},
      tag: data.id, // For notification grouping
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ],
      requireInteraction: data.priority === 'high' || data.priority === 'urgent'
    };

    const notificationPromise = self.registration.showNotification(data.title, options);
    event.waitUntil(notificationPromise);
    
    swLog('Push event processed successfully');
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  swLog('Notification clicked', event);
  event.notification.close();

  // Handle notification actions
  if (event.action === 'view' && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Default behavior when clicking the notification body
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // If a window is already open, focus it
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        // Otherwise open a new window
        return clients.openWindow('/');
      })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  // Optional: Track when notifications are dismissed
  swLog('Notification was closed', event.notification);
});

// Add a message handler for debugging
self.addEventListener('message', function(event) {
  swLog('Received message in service worker', event.data);
  
  if (event.data.action === 'checkServiceWorker') {
    swLog('Received checkServiceWorker message', event.data);
    event.ports[0].postMessage({
      status: 'active',
      timestamp: new Date().toISOString()
    });
  } else if (event.data.action === 'ping') {
    // Simple ping-pong to check if service worker is responsive
    swLog('Ping received, sending pong');
    event.ports[0].postMessage({
      action: 'pong',
      timestamp: new Date().toISOString()
    });
  }
});

// Report errors to the client
self.addEventListener('error', function(event) {
  swLog('Service Worker error:', event.error);
});
