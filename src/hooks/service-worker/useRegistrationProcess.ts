
export const useRegistrationProcess = () => {
  const registerWorker = async () => {
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
    
    // Wait for the service worker to be activated - increase timeout to 20 seconds
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout after 20s'));
      }, 20000);

      // If already activated, resolve immediately
      if (registration.active) {
        clearTimeout(timeout);
        console.log('Service worker already active');
        resolve(true);
        return;
      }

      // Wait for the installing worker to become activated
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          console.log(`Service worker state: ${newWorker.state}`);
          if (newWorker.state === 'activated') {
            clearTimeout(timeout);
            console.log('Service worker activated successfully');
            resolve(true);
          } else if (newWorker.state === 'redundant') {
            clearTimeout(timeout);
            reject(new Error('Service worker installation failed'));
          }
        });
      });
      
      // Also listen for activation events on the registration
      registration.addEventListener('activate', () => {
        clearTimeout(timeout);
        console.log('Service worker activated event fired');
        resolve(true);
      });
    });
    
    // Verify service worker is controlling the page
    if (!navigator.serviceWorker.controller) {
      console.warn('Service worker registered but not controlling page - forcing reload');
      window.location.reload();
    } else {
      console.log('Service worker is controlling the page');
    }
    
    return true;
  };

  return {
    registerWorker
  };
};
