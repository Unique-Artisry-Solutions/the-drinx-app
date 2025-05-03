
type ErrorContext = Record<string, any>;

export function logAuthError(action: string, error: any, context?: ErrorContext) {
  console.error(`[AUTH ERROR] ${action}: ${error?.message || 'Unknown error'}`, {
    error,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Determine category for better handling
  const category = categorizeAuthError(error);
  
  return category;
}

// Categorize common auth errors for better handling
export function categorizeAuthError(error: any): 'credentials' | 'verification' | 'network' | 'timeout' | 'generic' {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('invalid login') || message.includes('invalid email') || message.includes('invalid password')) {
    return 'credentials';
  }
  
  if (message.includes('email not verified') || message.includes('email not confirmed')) {
    return 'verification';
  }
  
  if (message.includes('network') || message.includes('connection') || message.includes('offline')) {
    return 'network';
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'timeout';
  }
  
  return 'generic';
}
