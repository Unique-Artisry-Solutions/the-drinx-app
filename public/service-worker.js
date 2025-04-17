
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.content,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.metadata || {},
    tag: data.id // For notification grouping
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
