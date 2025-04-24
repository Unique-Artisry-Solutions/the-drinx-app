// Service Worker Configuration
const SW_VERSION = '1.0.0';

// Debugging helper with timestamp
const swLog = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
  console.log(`[ServiceWorker ${timestamp}] ${logMessage}`, data);
};

// Log service worker startup
swLog('Service Worker initialization started', { version: SW_VERSION });

// ====== Lifecycle Events ======

// Install: Set up service worker
self.addEventListener('install', event => {
  swLog('Installing Service Worker');
  // Force activation
  self.skipWaiting();
  swLog('Skip waiting called - will activate immediately');
});

// Activate: Take control of clients
self.addEventListener('activate', event => {
  swLog('Service Worker activated');
  
  event.waitUntil(
    self.clients.claim()
      .then(() => {
        swLog('Successfully claimed all clients');
        return self.clients.matchAll();
      })
      .then(clients => {
        notifyClients(clients, {
          type: 'SW_ACTIVATED',
          timestamp: new Date().toISOString()
        });
        swLog(`Notified ${clients.length} clients about activation`);
      })
      .catch(err => {
        swLog('Error claiming clients:', err);
      })
  );
});

// ====== Client Communication Helpers ======

// Send message to all connected clients
const notifyClients = (clients, message) => {
  clients.forEach(client => {
    client.postMessage(message);
    swLog(`Sent message to client: ${client.id}`, { messageType: message.type });
  });
};

// Function to relay notification data to all clients
const relayNotificationToClients = (notificationData) => {
  self.clients.matchAll().then(clients => {
    notifyClients(clients, {
      type: 'PUSH_NOTIFICATION_RECEIVED',
      notification: notificationData,
      timestamp: new Date().toISOString()
    });
  });
};

// ====== Push Notification Handling ======

// Create default notification options
const createDefaultNotificationOptions = () => ({
  body: 'You have a new notification',
  icon: '/favicon.ico',
  badge: '/favicon.ico',
  tag: 'default-notification',
  vibrate: [200, 100, 200],
  requireInteraction: true
});

// Parse notification data from push event
const parseNotificationData = (event) => {
  if (!event.data) {
    swLog('No data received in push event, using defaults');
    return {
      title: 'New Notification',
      options: createDefaultNotificationOptions()
    };
  }
  
  try {
    const data = event.data.json();
    swLog('Push data parsed', data);
    
    const options = {
      body: data.content || data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.id || 'notification-' + Date.now(),
      vibrate: [200, 100, 200],
      data: data.metadata || data || {},
      requireInteraction: data.priority === 'high' || data.priority === 'urgent'
    };
    
    // Add actions if we have them
    options.actions = data.actions && Array.isArray(data.actions) 
      ? data.actions 
      : [
          { action: 'view', title: 'View' },
          { action: 'close', title: 'Close' }
        ];
    
    return {
      title: data.title || 'New Notification',
      options,
      data
    };
  } catch (parseError) {
    swLog('Error parsing push data', parseError);
    return {
      title: 'New Notification',
      options: createDefaultNotificationOptions()
    };
  }
};

// Handle push events
self.addEventListener('push', function(event) {
  try {
    swLog('Received push event', event);
    
    const { title, options, data } = parseNotificationData(event);
    
    // Show the notification
    swLog('Showing notification', { title, options });
    
    // Also pass notification data to any open clients
    if (data) {
      relayNotificationToClients(data);
    }
    
    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);
    
    swLog('Push event processed successfully');
  } catch (error) {
    swLog('Error processing push notification', error);
  }
});

// ====== Notification Event Handling ======

// Handle notification click events
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

// Track notification close events
self.addEventListener('notificationclose', function(event) {
  swLog('Notification was closed', event.notification);
});

// ====== Message Handling ======

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle messages from clients
self.addEventListener('message', function(event) {
  swLog('Received message in service worker', event.data);
  
  switch (event.data.action) {
    case 'checkServiceWorker':
      handleServiceWorkerCheck(event);
      break;
    case 'ping':
      handlePing(event);
      break;
    case 'showTestNotification':
      handleTestNotification(event);
      break;
    default:
      break;
  }
});

// Handle service worker check message
function handleServiceWorkerCheck(event) {
  swLog('Received checkServiceWorker message', event.data);
  
  const response = {
    status: 'active',
    timestamp: new Date().toISOString()
  };
  
  sendResponse(event, response);
}

// Handle ping message
function handlePing(event) {
  swLog('Ping received, sending pong');
  
  const response = {
    action: 'pong',
    timestamp: new Date().toISOString()
  };
  
  sendResponse(event, response);
}

// Handle test notification message
function handleTestNotification(event) {
  console.log('[ServiceWorker] Showing test notification from client request:', event.data);
  
  const { title, options } = event.data;
  
  return self.registration.showNotification(title, options)
    .then(() => {
      console.log('[ServiceWorker] Test notification shown successfully');
      const response = {
        success: true,
        message: 'Test notification sent successfully',
        timestamp: new Date().toISOString()
      };
      
      // Send response back through MessageChannel if available
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(response);
      }
      
      return response;
    })
    .catch(error => {
      console.error('[ServiceWorker] Error showing notification:', error);
      const response = {
        success: false,
        error: error.message || 'Failed to show notification',
        timestamp: new Date().toISOString()
      };
      
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(response);
      }
      
      return response;
    });
}

// Send response back to client
function sendResponse(event, data) {
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage(data);
  } else if (event.source) {
    event.source.postMessage(data);
  }
}

// Report errors to the client
self.addEventListener('error', function(event) {
  swLog('Service Worker error:', event.error);
});

// Periodic ping to keep service worker alive (every 25 minutes)
setInterval(() => {
  swLog('Sending periodic keep-alive ping');
  self.clients.matchAll().then(clients => {
    notifyClients(clients, {
      type: 'SW_PING',
      timestamp: new Date().toISOString()
    });
  });
}, 25 * 60 * 1000);

// Log service worker initialization complete
swLog('Service Worker initialization complete');
