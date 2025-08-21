/**
 * Service worker error handler with proper origin validation
 */

const VALID_ORIGINS = [
  'https://sandbox.lovable.dev',
  'https://localhost:3000',
  'http://localhost:3000',
];

/**
 * Safely send postMessage to service worker with error handling
 */
export const safePostMessage = (message: any, transferable?: Transferable[]): boolean => {
  try {
    if (!navigator.serviceWorker?.controller) {
      console.warn('No service worker controller available');
      return false;
    }

    // Add origin validation
    const currentOrigin = window.location.origin;
    const messageWithOrigin = {
      ...message,
      origin: currentOrigin,
      timestamp: new Date().toISOString()
    };

    navigator.serviceWorker.controller.postMessage(messageWithOrigin, transferable);
    return true;
  } catch (error) {
    console.error('Failed to post message to service worker:', error);
    return false;
  }
};

/**
 * Create a safe message handler for service worker communication
 */
export const createSafeMessageHandler = (
  handler: (event: MessageEvent) => void,
  allowedOrigins: string[] = VALID_ORIGINS
) => {
  return (event: MessageEvent) => {
    try {
      // Validate origin
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) {
        console.warn('Rejected message from invalid origin:', event.origin);
        return;
      }

      // Validate message structure
      if (!event.data || typeof event.data !== 'object') {
        console.warn('Rejected invalid message format');
        return;
      }

      handler(event);
    } catch (error) {
      console.error('Error handling service worker message:', error);
    }
  };
};

/**
 * Safe BroadcastChannel postMessage with origin validation
 */
export const safeBroadcastMessage = (channelName: string, message: any): boolean => {
  try {
    const channel = new BroadcastChannel(channelName);
    const messageWithOrigin = {
      ...message,
      origin: window.location.origin,
      timestamp: new Date().toISOString()
    };
    
    channel.postMessage(messageWithOrigin);
    channel.close();
    return true;
  } catch (error) {
    console.error(`Failed to broadcast message on channel ${channelName}:`, error);
    return false;
  }
};