
/**
 * Essential development debugging utilities
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
  
  zIndexElements.sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
  
  console.group('🔍 Z-Index Debug');
  zIndexElements.forEach(({ element, zIndex, selector }) => {
    console.log(`z-index: ${zIndex} - ${selector}`, element);
  });
  console.groupEnd();
  
  return zIndexElements;
};

export const debugDevSwitcherVisibility = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const devSwitcher = document.querySelector('[class*="DevRoleSwitcher"]');
  
  if (!devSwitcher) {
    console.warn('🚨 DevRoleSwitcher not found');
    return false;
  }
  
  const rect = devSwitcher.getBoundingClientRect();
  console.log('🛠️ DevRoleSwitcher visible:', rect.width > 0 && rect.height > 0);
  
  return true;
};
