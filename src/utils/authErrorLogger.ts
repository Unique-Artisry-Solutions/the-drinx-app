/**
 * Auth Error Logger
 * Provides enhanced error logging for authentication operations
 */

// Define error categories for better handling
export type AuthErrorCategory = 
  | 'network'     // Connection issues
  | 'credentials'  // Invalid login credentials
  | 'verification' // Email verification issues
  | 'timeout'      // Request timeouts
  | 'server'       // Server-side errors
  | 'permission'   // Permission/access denied
  | 'expired'      // Expired tokens/sessions
  | 'validation'   // Input validation errors
  | 'unknown';     // Other/unknown errors

/**
 * Categorizes an authentication error based on its message
 */
export const categorizeAuthError = (error: Error): AuthErrorCategory => {
  const errorMsg = error.message.toLowerCase();
  
  if (errorMsg.includes('network') || errorMsg.includes('connection') || 
      errorMsg.includes('offline') || errorMsg.includes('unreachable')) {
    return 'network';
  }
  
  if (errorMsg.includes('invalid') || errorMsg.includes('incorrect') || 
      errorMsg.includes('wrong') || errorMsg.includes('password') || 
      errorMsg.includes('not found') || errorMsg.includes('not exist')) {
    return 'credentials';
  }
  
  if ((errorMsg.includes('email') && errorMsg.includes('verify')) ||
      errorMsg.includes('confirmation') || errorMsg.includes('not confirmed')) {
    return 'verification';
  }
  
  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return 'timeout';
  }
  
  if (errorMsg.includes('server') || errorMsg.includes('500') || 
      errorMsg.includes('unavailable') || errorMsg.includes('maintenance')) {
    return 'server';
  }
  
  if (errorMsg.includes('permission') || errorMsg.includes('denied') || 
      errorMsg.includes('forbidden') || errorMsg.includes('403')) {
    return 'permission';
  }
  
  if (errorMsg.includes('expired') || errorMsg.includes('invalid token') || 
      errorMsg.includes('session')) {
    return 'expired';
  }
  
  if (errorMsg.includes('validation') || errorMsg.includes('required field') || 
      errorMsg.includes('format')) {
    return 'validation';
  }
  
  return 'unknown';
};

/**
 * Logs auth errors with enhanced context information
 */
export const logAuthError = (
  context: string,
  error: Error,
  additionalInfo?: Record<string, any>
): AuthErrorCategory => {
  const category = categorizeAuthError(error);
  const timestamp = new Date().toISOString();
  const errorId = `auth_error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  console.error(`[AUTH ERROR ${errorId}] ${timestamp} (${category}) in ${context}:`, error);
  
  if (additionalInfo) {
    console.error(`[AUTH ERROR ${errorId}] Additional context:`, additionalInfo);
  }
  
  // Log to localStorage for persistent error tracking (last 5 errors)
  try {
    const storedErrors = JSON.parse(localStorage.getItem('auth_error_log') || '[]');
    storedErrors.unshift({
      id: errorId,
      timestamp,
      context, 
      category,
      message: error.message,
      stack: error.stack,
      additionalInfo
    });
    
    // Keep only the most recent 5 errors
    while (storedErrors.length > 5) {
      storedErrors.pop();
    }
    
    localStorage.setItem('auth_error_log', JSON.stringify(storedErrors));
  } catch (storageError) {
    console.warn('Failed to store auth error in localStorage:', storageError);
  }
  
  return category;
};

/**
 * Get user-friendly error message based on error category and original message
 */
export const getFriendlyAuthErrorMessage = (
  category: AuthErrorCategory,
  originalMessage: string
): string => {
  // Default friendly messages by category
  const defaultMessages: Record<AuthErrorCategory, string> = {
    network: "Unable to connect to the authentication service. Please check your internet connection.",
    credentials: "The email/username or password you entered is incorrect.",
    verification: "Your email address has not been verified. Please check your inbox for a verification email.",
    timeout: "The request took too long to complete. Please try again.",
    server: "The server encountered an error. Please try again later.",
    permission: "You don't have permission to perform this action.",
    expired: "Your session has expired. Please log in again.",
    validation: "Please check the information you provided and try again.",
    unknown: "An unexpected error occurred. Please try again."
  };
  
  // Try to extract specific information from certain error types
  if (category === 'credentials' && originalMessage.toLowerCase().includes('email')) {
    return "The email address you entered doesn't exist in our system.";
  }
  
  if (category === 'credentials' && originalMessage.toLowerCase().includes('password')) {
    return "The password you entered is incorrect.";
  }
  
  if (category === 'verification' && originalMessage.toLowerCase().includes('resend')) {
    return "Email not verified. Click below to resend the verification email.";
  }
  
  // Use the default message for this category
  return defaultMessages[category];
};

/**
 * Get appropriate recovery action based on error category
 */
export const getAuthErrorRecoveryAction = (category: AuthErrorCategory): string => {
  switch (category) {
    case 'network':
      return "Check your internet connection and try again";
    case 'credentials':
      return "Reset your password";
    case 'verification':
      return "Resend verification email";
    case 'timeout':
      return "Try again";
    case 'server':
      return "Try again later";
    case 'expired':
      return "Log in again";
    case 'validation':
      return "Edit your information";
    case 'permission':
      return "Contact support";
    default:
      return "Try again";
  }
};
