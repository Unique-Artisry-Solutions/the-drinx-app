
export const useRegistrationProcess = () => {
  const registerWorker = async () => {
    console.log('Starting service worker registration process...');
    
    try {
      console.log('Getting service worker registrations...');
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // First clean up any existing service workers to avoid conflicts
      if (registrations.length > 0) {
        console.log(`Found ${registrations.length} existing service worker(s), unregistering...`);
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Unregistered existing service workers');
      }
      
      console.log('Registering new service worker...');
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        // Use cache busting to ensure the latest version is loaded
        updateViaCache: 'none',
        // Scope for broad control
        scope: '/'
      });
      console.log('Service worker registered:', registration);
      
      // Instead of waiting for activation, check if we have an active worker
      if (registration.active) {
        console.log('Service worker already active');
        return true;
      }
      
      // Wait for the service worker to be activated with a timeout and progress logging
      console.log('Waiting for service worker to activate...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn('Service worker activation timed out after 10s');
          
          // Even if timeout occurs, we'll attempt to continue rather than fail
          resolve(false);
        }, 10000);
        
        // Watch for state changes in the installing worker
        if (registration.installing) {
          const newWorker = registration.installing;
          
          // Log progress
          const stateInterval = setInterval(() => {
            console.log(`Waiting for worker... current state: ${newWorker.state}`);
          }, 1000);
          
          newWorker.addEventListener('statechange', () => {
            console.log(`Service worker state changed to: ${newWorker.state}`);
            
            if (newWorker.state === 'activated') {
              clearTimeout(timeout);
              clearInterval(stateInterval);
              console.log('Service worker activated successfully');
              resolve(true);
            } else if (newWorker.state === 'redundant') {
              clearTimeout(timeout);
              clearInterval(stateInterval);
              console.warn('Service worker became redundant');
              resolve(false);
            }
          });
        } else {
          // No installing worker means we're in an unexpected state
          clearTimeout(timeout);
          console.warn('No installing worker found');
          resolve(false);
        }
      });
      
      // Verify controller status and handle fallback
      const hasController = !!navigator.serviceWorker.controller;
      console.log('Service worker controller status:', hasController ? 'Active' : 'Not controlling');
      
      // If no controller but registration succeeded, the page may need to be reloaded
      // But we'll continue rather than forcing a reload
      
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      
      // Try to recover by checking if we at least have a controller
      const hasController = !!navigator.serviceWorker.controller;
      if (hasController) {
        console.log('Registration failed but found existing controller');
        return true;
      }
      
      throw error;
    }
  };

  return {
    registerWorker
  };
};
