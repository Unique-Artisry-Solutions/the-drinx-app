
console.log('Service Worker Loaded');

// Debugging helper with timestamp
const swLog = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
  console.log(`[ServiceWorker ${timestamp}] ${logMessage}`, data);
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
    
    // Default notification if we can't parse data
    let title = 'New Notification';
    let options = {
      body: 'You have a new notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'default-notification',
      vibrate: [200, 100, 200],
      requireInteraction: true
    };
    
    // Try to parse the push data
    if (event.data) {
      try {
        const data = event.data.json();
        swLog('Push data parsed', data);
        
        title = data.title || title;
        options = {
          body: data.content || data.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: data.id || 'notification-' + Date.now(), 
          vibrate: [200, 100, 200],
          data: data.metadata || data || {},
          requireInteraction: data.priority === 'high' || data.priority === 'urgent'
        };
        
        // Add actions if we have them
        if (data.actions && Array.isArray(data.actions)) {
          options.actions = data.actions;
        } else {
          options.actions = [
            {
              action: 'view',
              title: 'View'
            },
            {
              action: 'close',
              title: 'Close'
            }
          ];
        }
      } catch (parseError) {
        swLog('Error parsing push data', parseError);
        // Continue with default notification
      }
    } else {
      swLog('No data received in push event, using defaults');
    }
    
    // Show the notification
    swLog('Showing notification', { title, options });
    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
    
    swLog('Push event processed successfully');
  } catch (error) {
    swLog('Error processing push notification', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  swLog('Notification clicked', event);
  event.notification.close();

  // Handle notification actions
  if (event.action === 'view' && event.notification.data && event.notification.data.url) {
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
  // Track when notifications are dismissed
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
  } else if (event.data.action === 'showTestNotification') {
    // Handle direct test notification request from client
    swLog('Showing test notification from client request');
    const title = event.data.title || 'Test Notification';
    const options = event.data.options || {
      body: 'This is a test notification from the service worker',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      timestamp: Date.now()
    };
    
    self.registration.showNotification(title, options)
      .then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            success: true,
            message: 'Test notification sent successfully',
            timestamp: new Date().toISOString()
          });
        }
      })
      .catch(error => {
        swLog('Error showing notification', error);
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            success: false,
            error: error.message || 'Failed to show notification',
            timestamp: new Date().toISOString()
          });
        }
      });
  }
});

// Report errors to the client
self.addEventListener('error', function(event) {
  swLog('Service Worker error:', event.error);
});
