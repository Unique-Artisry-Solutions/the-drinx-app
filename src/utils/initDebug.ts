/**
 * Simple debugging utility for tracking app initialization
 */

let debugStartTime = Date.now();

export const initDebug = {
  log: (step: string, data?: any) => {
    const elapsed = Date.now() - debugStartTime;
    console.log(`🔍 [${elapsed}ms] ${step}`, data || '');
  },
  
  error: (step: string, error: any) => {
    const elapsed = Date.now() - debugStartTime;
    console.error(`❌ [${elapsed}ms] ${step}`, error);
  },
  
  warn: (step: string, data?: any) => {
    const elapsed = Date.now() - debugStartTime;
    console.warn(`⚠️ [${elapsed}ms] ${step}`, data || '');
  },
  
  resetTimer: () => {
    debugStartTime = Date.now();
  }
};

// Log when this module loads
initDebug.log('initDebug module loaded');