// Service Worker Configuration
const SW_VERSION = '1.1.0';

// ====== Debugging System ======
const DEBUG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current debug level
let currentDebugLevel = DEBUG_LEVELS.INFO;

// Enhanced logging system with timestamp and levels
const swLogger = {
  error: (message, data = {}) => logWithLevel('ERROR', message, data),
  warn: (message, data = {}) => logWithLevel('WARN', message, data),
  info: (message, data = {}) => logWithLevel('INFO', message, data),
  debug: (message, data = {}) => logWithLevel('DEBUG', message, data),
  
  // Set debug level
  setLevel: (level) => {
    if (DEBUG_LEVELS[level] !== undefined) {
      currentDebugLevel = DEBUG_LEVELS[level];
      logWithLevel('INFO', `Debug level set to ${level}`);
    }
  }
};

// Internal logging helper with level filtering
function logWithLevel(level, message, data = {}) {
  if (DEBUG_LEVELS[level] <= currentDebugLevel) {
    const timestamp = new Date().toISOString();
    const logMessage = typeof message === 'string' ? message : JSON.stringify(message);
    
    const logData = {
      timestamp,
      level,
      ...data
    };
    
    if (level === 'ERROR') {
      console.error(`[ServiceWorker ${timestamp}] [${level}] ${logMessage}`, logData);
    } else if (level === 'WARN') {
      console.warn(`[ServiceWorker ${timestamp}] [${level}] ${logMessage}`, logData);
    } else {
      console.log(`[ServiceWorker ${timestamp}] [${level}] ${logMessage}`, logData);
    }
  }
}

// Legacy log function for backward compatibility
const swLog = (message, data = {}) => swLogger.info(message, data);

// ====== Initialization ======
swLogger.info('Service Worker initialization started', { version: SW_VERSION });

// ====== Lifecycle Management ======

// Install: Set up service worker
self.addEventListener('install', event => {
  swLogger.info('Installing Service Worker');
  // Force activation
  self.skipWaiting();
  swLogger.info('Skip waiting called - will activate immediately');
});

// Activate: Take control of clients
self.addEventListener('activate', event => {
  swLogger.info('Service Worker activated');
  
  event.waitUntil(
    self.clients.claim()
      .then(() => {
        swLogger.info('Successfully claimed all clients');
        return self.clients.matchAll();
      })
      .then(clients => {
        clientCommunication.notifyAll(clients, {
          type: 'SW_ACTIVATED',
          timestamp: new Date().toISOString()
        });
        swLogger.info(`Notified ${clients.length} clients about activation`);
      })
      .catch(err => {
        swLogger.error('Error claiming clients:', { error: err.toString() });
      })
  );
});

// Report errors to the client
self.addEventListener('error', function(event) {
  swLogger.error('Service Worker error:', { error: event.error?.toString() });
});

// ====== Client Communication Module ======
const clientCommunication = {
  // Send message to all connected clients
  notifyAll: (clients, message) => {
    try {
      clients.forEach(client => {
        client.postMessage(message);
        swLogger.debug(`Sent message to client: ${client.id}`, { messageType: message.type });
      });
    } catch (error) {
      swLogger.error('Error notifying clients:', { error: error.toString() });
    }
  },

  // Send message to specific client
  notifyClient: (client, message) => {
    try {
      if (client && typeof client.postMessage === 'function') {
        client.postMessage(message);
        swLogger.debug(`Sent message to client: ${client.id}`, { messageType: message.type });
        return true;
      }
      return false;
    } catch (error) {
      swLogger.error('Error sending message to client:', { error: error.toString() });
      return false;
    }
  }
};

// ====== Notification Helpers ======
const notificationHelpers = {
  // Create default notification options
  createDefaultOptions: () => ({
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'default-notification',
    vibrate: [200, 100, 200],
    requireInteraction: true
  }),
  
  // Show a notification with diagnostic info
  showNotification: async (title, options) => {
    try {
      swLogger.debug('Showing notification', { title, options });
      
      // Permission check
      if (self.Notification && self.Notification.permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      // Validate options
      if (!title || typeof title !== 'string') {
        throw new Error('Invalid notification title');
      }

      // Show the notification
      await self.registration.showNotification(title, options);
      swLogger.info('Notification shown successfully', { title });
      return true;
    } catch (error) {
      swLogger.error('Failed to show notification', { 
        error: error.toString(),
        title,
        options
      });
      return false;
    }
  },
  
  // Test notification system health
  testNotificationSystem: async () => {
    try {
      const testTitle = 'Notification System Test';
      const testOptions = {
        body: 'Testing notification system at ' + new Date().toISOString(),
        icon: '/favicon.ico',
        tag: 'test-system-' + Date.now()
      };
      
      const result = await notificationHelpers.showNotification(testTitle, testOptions);
      return {
        success: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      swLogger.error('Test notification failed', { error: error.toString() });
      return {
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      };
    }
  }
};

// ====== Event Handlers ======

// Handle push events
self.addEventListener('push', function(event) {
  try {
    swLogger.info('Received push event', { hasData: !!event.data });
    
    const { title, options, data } = notificationHelpers.parseNotificationData(event);
    
    // Show the notification
    const notificationPromise = notificationHelpers.showNotification(title, options);
    
    // Also pass notification data to any open clients
    if (data) {
      clientCommunication.relayNotificationToClients(data);
    }
    
    event.waitUntil(notificationPromise);
    
    swLogger.info('Push event processed successfully');
  } catch (error) {
    swLogger.error('Error processing push notification', { error: error.toString() });
  }
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  swLogger.info('Notification clicked', { 
    tag: event.notification.tag,
    action: event.action 
  });
  
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
  swLogger.info('Notification was closed', { tag: event.notification.tag });
});

// ====== Message Handlers ======

// Handler registry for message actions
const messageHandlers = {
  // Check if service worker is active and responding
  checkServiceWorker: (event) => {
    swLogger.info('Received checkServiceWorker message', { data: event.data });
    
    const response = {
      status: 'active',
      version: SW_VERSION,
      timestamp: new Date().toISOString()
    };
    
    return clientCommunication.sendResponse(event, response);
  },
  
  // Simple ping/pong for testing connectivity
  ping: (event) => {
    swLogger.info('Ping received, sending pong');
    
    const response = {
      action: 'pong',
      timestamp: new Date().toISOString()
    };
    
    return clientCommunication.sendResponse(event, response);
  },
  
  // Test diagnostics for client troubleshooting
  diagnostics: (event) => {
    swLogger.info('Running service worker diagnostics');
    
    const response = {
      version: SW_VERSION,
      status: 'active',
      clients: 'pending',
      timestamp: new Date().toISOString()
    };
    
    // Get client count asynchronously
    self.clients.matchAll().then(clients => {
      response.clients = clients.length;
      clientCommunication.sendResponse(event, response);
    });
    
    return true;
  }
};

// Handle messages from clients
self.addEventListener('message', function(event) {
  try {
    const action = event.data?.action;
    
    if (!action) {
      swLogger.warn('Received message with no action', { data: event.data });
      return;
    }
    
    swLogger.info(`Handling message action: ${action}`, { 
      source: event.source?.id || 'unknown',
      hasPortsChannel: !!event.ports?.length 
    });
    
    // Check if we have a handler for this action
    if (messageHandlers[action] && typeof messageHandlers[action] === 'function') {
      messageHandlers[action](event);
    } else {
      swLogger.warn(`No handler for action: ${action}`);
      
      // Send error response if possible
      if (event.ports?.[0]) {
        event.ports[0].postMessage({
          success: false,
          error: `Action not supported: ${action}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    swLogger.error('Error handling message', { 
      error: error.toString(),
      data: event.data 
    });
    
    // Try to send error response
    if (event.ports?.[0]) {
      try {
        event.ports[0].postMessage({
          success: false,
          error: error.toString(),
          timestamp: new Date().toISOString()
        });
      } catch (responseError) {
        swLogger.error('Failed to send error response', { error: responseError.toString() });
      }
    }
  }
});

// Periodic ping to keep service worker alive (every 25 minutes)
setInterval(() => {
  swLogger.debug('Sending periodic keep-alive ping');
  self.clients.matchAll().then(clients => {
    clientCommunication.notifyAll(clients, {
      type: 'SW_PING',
      timestamp: new Date().toISOString()
    });
  }).catch(error => {
    swLogger.error('Error sending keep-alive ping', { error: error.toString() });
  });
}, 25 * 60 * 1000);

// ====== CORS Headers ======
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Log service worker initialization complete
swLogger.info('Service Worker initialization complete');
