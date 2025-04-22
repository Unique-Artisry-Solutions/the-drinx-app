
self.addEventListener('push', function(event) {
  try {
    console.log('Received push event:', event);
    const data = event.data.json();
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
    
    console.log('Push event processed successfully');
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();

  // Handle notification actions
  if (event.action === 'view' && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  // Optional: Track when notifications are dismissed
  console.log('Notification was closed', event.notification);
});

// Add a message handler for debugging
self.addEventListener('message', function(event) {
  if (event.data.action === 'checkServiceWorker') {
    event.ports[0].postMessage({
      status: 'active',
      timestamp: new Date().toISOString()
    });
  }
});
