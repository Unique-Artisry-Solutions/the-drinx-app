
export const useRegistrationProcess = () => {
  const registerWorker = async () => {
    console.log('Getting service worker registrations...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    const hasActiveWorker = registrations.some(registration => 
      registration.active && registration.active.scriptURL.includes('service-worker.js')
    );
    
    if (!hasActiveWorker) {
      console.log('No active service worker found, registering new one...');
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered:', registration);
      
      // Wait for the service worker to be ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Service worker registration timeout'));
        }, 5000);

        registration.addEventListener('activate', () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });
    }
    
    return true;
  };

  return {
    registerWorker
  };
};
