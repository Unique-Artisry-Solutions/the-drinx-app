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
  },
  
  // Function to relay notification data to all clients
  relayNotificationToClients: (notificationData) => {
    self.clients.matchAll()
      .then(clients => {
        clientCommunication.notifyAll(clients, {
          type: 'PUSH_NOTIFICATION_RECEIVED',
          notification: notificationData,
          timestamp: new Date().toISOString()
        });
      })
      .catch(error => {
        swLogger.error('Error relaying notification to clients:', { error: error.toString() });
      });
  },
  
  // Send response back to client using available channels
  sendResponse: (event, data) => {
    try {
      let sent = false;
      
      // If MessagePort is available, use it (most reliable)
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(data);
        sent = true;
        swLogger.debug('Response sent via MessagePort');
      } 
      // If client source is available, use it as fallback
      else if (event.source) {
        event.source.postMessage(data);
        sent = true;
        swLogger.debug('Response sent via event.source');
      }
      
      if (!sent) {
        swLogger.warn('No channel available to send response', { event: 'responseFailure' });
      }
      
      return sent;
    } catch (error) {
      swLogger.error('Error sending response:', { error: error.toString() });
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
  
  // Parse notification data from push event
  parseNotificationData: (event) => {
    if (!event.data) {
      swLogger.info('No data received in push event, using defaults');
      return {
        title: 'New Notification',
        options: notificationHelpers.createDefaultOptions()
      };
    }
    
    try {
      const data = event.data.json();
      swLogger.debug('Push data parsed', { data });
      
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
      swLogger.error('Error parsing push data', { error: parseError.toString() });
      return {
        title: 'New Notification',
        options: notificationHelpers.createDefaultOptions()
      };
    }
  },
  
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
  },
  
  // Show a test notification from client request
  showTestNotification: async (event) => {
    try {
      swLogger.info('Processing test notification request', { 
        data: event.data,
        hasMessageChannel: !!event.ports?.length
      });
      
      // Extract the notification details
      const { title, options } = event.data;
      
      if (!title || !options) {
        throw new Error('Invalid notification parameters');
      }
      
      // Add tracking info
      options.data = options.data || {};
      options.data.source = 'test-request';
      options.data.timestamp = new Date().toISOString();
      
      // Show the notification
      swLogger.debug('Showing test notification', { title, options });
      await self.registration.showNotification(title, options);
      
      swLogger.info('Test notification shown successfully');
      const response = {
        success: true,
        message: 'Test notification sent successfully',
        timestamp: new Date().toISOString()
      };
      
      // Send response back
      if (event.ports && event.ports[0]) {
        swLogger.debug('Sending success response through MessageChannel');
        event.ports[0].postMessage(response);
      } else {
        swLogger.warn('No MessageChannel available for response');
      }
      
      return response;
    } catch (error) {
      swLogger.error('Error showing test notification', { 
        error: error.toString(),
        data: event.data 
      });
      
      const response = {
        success: false,
        error: error.message || 'Failed to show notification',
        timestamp: new Date().toISOString()
      };
      
      // Send error response
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(response);
      }
      
      return response;
    }
  },
  
  // Set debug level for the service worker
  setDebugLevel: (event) => {
    const level = event.data.level || 'INFO';
    swLogger.setLevel(level);
    
    const response = {
      success: true,
      message: `Debug level set to ${level}`,
      timestamp: new Date().toISOString()
    };
    
    return clientCommunication.sendResponse(event, response);
  },
  
  // Run comprehensive health check
  healthCheck: async (event) => {
    swLogger.info('Running health check');
    
    try {
      // Test notification system
      const notificationTest = await notificationHelpers.testNotificationSystem();
      
      // Get client count
      const clients = await self.clients.matchAll();
      
      // Compile health data
      const healthData = {
        version: SW_VERSION,
        status: 'healthy',
        notificationPermission: self.Notification?.permission || 'unknown',
        clientCount: clients.length,
        notificationTest,
        timestamp: new Date().toISOString()
      };
      
      clientCommunication.sendResponse(event, healthData);
      return healthData;
    } catch (error) {
      swLogger.error('Health check failed', { error: error.toString() });
      
      const errorResponse = {
        status: 'error',
        error: error.toString(),
        timestamp: new Date().toISOString()
      };
      
      clientCommunication.sendResponse(event, errorResponse);
      return errorResponse;
    }
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
