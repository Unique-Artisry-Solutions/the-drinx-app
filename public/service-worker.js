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
        return self.clients.matchAll();
      })
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            timestamp: new Date().toISOString()
          });
        });
        swLog(`Notified ${clients.length} clients about activation`);
      })
      .catch(err => {
        swLog('Error claiming clients:', err);
      })
  );
});

// Function to relay notification data to all clients
const relayNotificationToClients = (notificationData) => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PUSH_NOTIFICATION_RECEIVED',
        notification: notificationData,
        timestamp: new Date().toISOString()
      });
      swLog(`Relayed notification to client: ${client.id}`);
    });
  });
};

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
    
    let notificationData = null;
    
    // Try to parse the push data
    if (event.data) {
      try {
        const data = event.data.json();
        swLog('Push data parsed', data);
        
        notificationData = data;
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
    
    // Also pass notification data to any open clients
    if (notificationData) {
      relayNotificationToClients(notificationData);
    }
    
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

  // Extract notification data
  const notificationData = event.notification.data;

  // Handle notification actions
  if (event.action === 'view' && notificationData && notificationData.url) {
    event.waitUntil(
      clients.openWindow(notificationData.url)
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
          
          // Notify the client that this notification was clicked
          client.postMessage({
            type: 'PUSH_NOTIFICATION_CLICKED',
            notificationId: notificationData?.id || event.notification.tag,
            timestamp: new Date().toISOString()
          });
          
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

// Add a message handler for improved client communication
self.addEventListener('message', function(event) {
  swLog('Received message in service worker', event.data);
  
  if (event.data.action === 'checkServiceWorker') {
    swLog('Received checkServiceWorker message', event.data);
    
    // Reply using the MessageChannel port if available
    if (event.ports && event.ports.length > 0) {
      event.ports[0].postMessage({
        status: 'active',
        timestamp: new Date().toISOString()
      });
      swLog('Sent active status response through MessageChannel');
    } else {
      // Fallback for older implementations
      event.source?.postMessage({
        action: 'serviceWorkerStatus',
        status: 'active',
        timestamp: new Date().toISOString()
      });
      swLog('Sent active status response directly to source');
    }
  } else if (event.data.action === 'ping') {
    // Simple ping-pong to check if service worker is responsive
    swLog('Ping received, sending pong');
    
    if (event.ports && event.ports.length > 0) {
      event.ports[0].postMessage({
        action: 'pong',
        timestamp: new Date().toISOString()
      });
    } else {
      event.source?.postMessage({
        action: 'pong',
        timestamp: new Date().toISOString()
      });
    }
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

// Periodic ping to keep service worker alive (every 25 minutes)
setInterval(() => {
  swLog('Sending periodic keep-alive ping');
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_PING',
        timestamp: new Date().toISOString()
      });
    });
  });
}, 25 * 60 * 1000);

// Log service worker startup
swLog('Service Worker initialization complete');
