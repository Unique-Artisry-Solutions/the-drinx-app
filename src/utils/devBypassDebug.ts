/**
 * Development bypass debugging utilities
 */

export const debugDevBypassState = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group('🔧 Dev Bypass Debug State');
  
  // Local storage inspection
  const devUserType = localStorage.getItem('dev_auto_login_user_type');
  console.log('Local Storage dev_auto_login_user_type:', devUserType);
  
  // Environment check
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Hostname:', window.location.hostname);
  console.log('Is Development Mode:', 
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('lovableproject.com')
  );
  
  // Supabase client check
  import('@/integrations/supabase/client').then(({ supabase }) => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Current Supabase Session:', { 
        user: data?.session?.user?.email,
        userType: data?.session?.user?.user_metadata?.user_type,
        error
      });
    });
  });
  
  // Development mode context inspection
  const devModeElements = document.querySelectorAll('[class*="DevBypass"]');
  console.log('DevBypass elements found:', devModeElements.length);
  
  devModeElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    console.log(`DevBypass element ${index + 1}:`, {
      visible: rect.width > 0 && rect.height > 0,
      position: rect,
      classList: el.className
    });
  });
  
  console.groupEnd();
};

// Auto-run debug when in development
if (process.env.NODE_ENV === 'development') {
  // Run debug after a short delay to ensure DOM is ready
  setTimeout(debugDevBypassState, 1000);
}