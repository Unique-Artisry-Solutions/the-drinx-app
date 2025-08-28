// Service Worker Configuration
const SW_VERSION = '1.2.0';
const CACHE_VERSION = 'v1.2.0';
const CACHE_STATIC = `static-${CACHE_VERSION}`;
const CACHE_RUNTIME = `runtime-${CACHE_VERSION}`;

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json'
];

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

// Install: Set up service worker and precache assets
self.addEventListener('install', event => {
  swLogger.info('Installing Service Worker', { version: SW_VERSION });
  
  event.waitUntil(
    Promise.all([
      // Precache essential assets
      caches.open(CACHE_STATIC).then(cache => {
        swLogger.info('Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Force activation
      self.skipWaiting()
    ]).then(() => {
      swLogger.info('Service Worker installation complete');
    }).catch(error => {
      swLogger.error('Service Worker installation failed', { error: error.toString() });
    })
  );
});

// Activate: Take control of clients and clean up old caches
self.addEventListener('activate', event => {
  swLogger.info('Service Worker activated', { version: SW_VERSION });
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(CACHE_VERSION)) {
              swLogger.info('Deleting old cache', { cacheName });
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of clients
      self.clients.claim()
    ]).then(() => {
      swLogger.info('Successfully claimed all clients and cleaned old caches');
      return self.clients.matchAll();
    }).then(clients => {
      clientCommunication.notifyAll(clients, {
        type: 'SW_ACTIVATED',
        timestamp: new Date().toISOString(),
        version: SW_VERSION
      });
      swLogger.info(`Notified ${clients.length} clients about activation`);
    }).catch(err => {
      swLogger.error('Error during activation:', { error: err.toString() });
    })
  );
});

// Report errors to the client
self.addEventListener('error', function(event) {
  swLogger.error('Service Worker error:', { error: event.error?.toString() });
});

// ====== Client Communication Module ======
const clientCommunication = {
  // Get safe origin for postMessage
  getSafeOrigin: () => {
    try {
      // Support multiple Lovable domains
      const allowedOrigins = [
        'https://lovable.dev',
        'https://sandbox.lovable.dev',
        'https://lovable.app',
        'https://lovableproject.com'
      ];
      
      // Get current origin from clients if possible
      return self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
          try {
            const clientUrl = new URL(clients[0].url);
            const origin = clientUrl.origin;
            
            // Check if it's a known Lovable domain pattern
            if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '')))) {
              return origin;
            }
          } catch (e) {
            swLogger.debug('Error parsing client URL:', { error: e.toString() });
          }
        }
        return '*'; // Fallback to wildcard
      });
    } catch (error) {
      swLogger.debug('Error determining safe origin:', { error: error.toString() });
      return Promise.resolve('*');
    }
  },

  // Send message to all connected clients with origin safety
  notifyAll: async (clients, message) => {
    try {
      const safeOrigin = await clientCommunication.getSafeOrigin();
      
      clients.forEach(client => {
        try {
          if (client && typeof client.postMessage === 'function') {
            client.postMessage(message, safeOrigin);
            swLogger.debug(`Sent message to client: ${client.id}`, { messageType: message.type });
          }
        } catch (clientError) {
          // Skip individual client errors but log them
          swLogger.debug('Failed to send to individual client:', { 
            error: clientError.toString(),
            clientId: client?.id 
          });
        }
      });
    } catch (error) {
      swLogger.error('Error notifying clients:', { error: error.toString() });
    }
  },

  // Send message to specific client with origin safety
  notifyClient: async (client, message) => {
    try {
      if (client && typeof client.postMessage === 'function') {
        const safeOrigin = await clientCommunication.getSafeOrigin();
        client.postMessage(message, safeOrigin);
        swLogger.debug(`Sent message to client: ${client.id}`, { messageType: message.type });
        return true;
      }
      return false;
    } catch (error) {
      swLogger.debug('Error sending message to client:', { 
        error: error.toString(),
        clientId: client?.id 
      });
      return false;
    }
  },

  // Send response back to client
  sendResponse: (event, response) => {
    try {
      if (event.ports?.[0]) {
        event.ports[0].postMessage(response);
        return true;
      }
      return false;
    } catch (error) {
      swLogger.debug('Error sending response:', { error: error.toString() });
      return false;
    }
  },
  
  // Relay notification data to clients
  relayNotificationToClients: async (data) => {
    try {
      const clients = await self.clients.matchAll();
      if (clients.length > 0) {
        await clientCommunication.notifyAll(clients, {
          type: 'PUSH_NOTIFICATION_RECEIVED',
          data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      swLogger.error('Error relaying notification to clients:', { error: error.toString() });
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
    let title = 'New Notification';
    let options = notificationHelpers.createDefaultOptions();
    let data = null;
    
    try {
      if (event.data) {
        const payload = event.data.json();
        title = payload.title || title;
        options = { ...options, ...payload.options };
        data = payload.data;
      }
    } catch (error) {
      swLogger.warn('Failed to parse push event data', { error: error.toString() });
    }
    
    return { title, options, data };
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
          
          // Notify the client that this notification was clicked with origin safety
          try {
            client.postMessage({
              type: 'PUSH_NOTIFICATION_CLICKED',
              notificationId: notificationData?.id || event.notification.tag,
              timestamp: new Date().toISOString()
            });
          } catch (postError) {
            swLogger.debug('Failed to notify client of notification click:', { error: postError.toString() });
          }
          
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
  
  // Show test notification
  showTestNotification: async (event) => {
    const { title, options } = event.data;
    
    try {
      const result = await notificationHelpers.showNotification(title, options);
      return clientCommunication.sendResponse(event, {
        success: true,
        message: 'Notification shown successfully'
      });
    } catch (error) {
      swLogger.error('Failed to show test notification:', { error: error.toString() });
      return clientCommunication.sendResponse(event, {
        success: false,
        error: error.toString()
      });
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
        try {
          event.ports[0].postMessage({
            success: false,
            error: `Action not supported: ${action}`,
            timestamp: new Date().toISOString()
          });
        } catch (postError) {
          swLogger.debug('Failed to send error response:', { error: postError.toString() });
        }
      }
    }
  } catch (error) {
    swLogger.error('Error handling message', { 
      error: error.toString(),
      data: event.data 
    });
    
    // Try to send error response with safety
    if (event.ports?.[0]) {
      try {
        event.ports[0].postMessage({
          success: false,
          error: error.toString(),
          timestamp: new Date().toISOString()
        });
      } catch (responseError) {
        swLogger.debug('Failed to send error response:', { error: responseError.toString() });
      }
    }
  }
});

// Periodic ping to keep service worker alive (every 25 minutes) with safe messaging
setInterval(() => {
  swLogger.debug('Sending periodic keep-alive ping');
  self.clients.matchAll().then(clients => {
    if (clients.length > 0) {
      clientCommunication.notifyAll(clients, {
        type: 'SW_PING',
        timestamp: new Date().toISOString()
      });
    }
  }).catch(error => {
    swLogger.debug('Error sending keep-alive ping', { error: error.toString() });
  });
}, 25 * 60 * 1000);

// ====== Caching Strategies ======

// Helper to determine if request is for navigation
const isNavigationRequest = (request) => {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
};

// Helper to determine if request is for static asset
const isStaticAsset = (url) => {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
};

// Fetch event handler with caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }
  
  if (isNavigationRequest(request)) {
    // Network-first strategy for HTML pages
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_RUNTIME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Try cache first, then offline fallback
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page for navigation requests
              return caches.match('/offline.html');
            });
        })
    );
  } else if (isStaticAsset(url)) {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, fetch and cache
        return fetch(request).then(response => {
          // Don't cache non-successful responses
          if (response.status !== 200) {
            return response;
          }
          
          const responseClone = response.clone();
          caches.open(CACHE_STATIC).then(cache => {
            cache.put(request, responseClone);
          });
          
          return response;
        });
      })
    );
  }
  // For other requests (API calls, etc.), let them go through normally
});

// ====== CORS Headers ======
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Log service worker initialization complete
swLogger.info('Service Worker initialization complete', { 
  version: SW_VERSION,
  cacheVersion: CACHE_VERSION 
});
