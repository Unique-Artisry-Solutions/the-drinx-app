
/**
 * Development debugging utilities
 */

/**
 * Debug z-index conflicts on the page
 */
export const debugZIndexConflicts = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const elements = document.querySelectorAll('*');
  const zIndexElements: Array<{ element: Element; zIndex: string; selector: string }> = [];
  
  elements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const zIndex = computedStyle.zIndex;
    
    if (zIndex !== 'auto' && parseInt(zIndex) > 0) {
      zIndexElements.push({
        element: el,
        zIndex,
        selector: el.tagName.toLowerCase() + (el.className ? `.${el.className.split(' ').join('.')}` : '')
      });
    }
  });
  
  // Sort by z-index value
  zIndexElements.sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
  
  console.group('🔍 Z-Index Conflicts Debug');
  console.log('Elements with z-index (highest to lowest):');
  zIndexElements.forEach(({ element, zIndex, selector }) => {
    console.log(`z-index: ${zIndex} - ${selector}`, element);
  });
  console.groupEnd();
  
  return zIndexElements;
};

/**
 * Check if DevRoleSwitcher is visible and properly positioned
 */
export const debugDevSwitcherVisibility = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const devSwitcher = document.querySelector('[class*="DevRoleSwitcher"], [data-testid="dev-role-switcher"]');
  
  if (!devSwitcher) {
    console.warn('🚨 DevRoleSwitcher element not found in DOM');
    return false;
  }
  
  const rect = devSwitcher.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(devSwitcher);
  
  console.group('🛠️ DevRoleSwitcher Visibility Debug');
  console.log('Element found:', devSwitcher);
  console.log('Bounding rect:', rect);
  console.log('Computed style:', {
    position: computedStyle.position,
    zIndex: computedStyle.zIndex,
    visibility: computedStyle.visibility,
    display: computedStyle.display,
    opacity: computedStyle.opacity
  });
  console.log('Is visible:', rect.width > 0 && rect.height > 0);
  console.groupEnd();
  
  return true;
};

/**
 * Add debug information to console for admin pages
 */
export const debugAdminPageContext = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const isAdminPath = window.location.pathname.startsWith('/admin');
  
  if (isAdminPath) {
    console.group('🏛️ Admin Page Debug Context');
    console.log('Current path:', window.location.pathname);
    console.log('Admin layout elements:', document.querySelectorAll('[class*="admin"]').length);
    console.log('High z-index elements:', document.querySelectorAll('[style*="z-index"]').length);
    
    // Check for common admin UI conflicts
    const adminNav = document.querySelector('nav[class*="admin"]');
    const adminSidebar = document.querySelector('[class*="sidebar"]');
    
    if (adminNav) {
      const navStyle = window.getComputedStyle(adminNav);
      console.log('Admin nav z-index:', navStyle.zIndex);
    }
    
    if (adminSidebar) {
      const sidebarStyle = window.getComputedStyle(adminSidebar);
      console.log('Admin sidebar z-index:', sidebarStyle.zIndex);
    }
    
    console.groupEnd();
  }
};

// Auto-run debug functions in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        debugAdminPageContext();
        debugDevSwitcherVisibility();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      debugAdminPageContext();
      debugDevSwitcherVisibility();
    }, 1000);
  }
}
