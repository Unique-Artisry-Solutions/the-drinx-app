// Security utilities for edge functions

interface SecurityConfig {
  allowedOrigins: string[];
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  enableIPRateLimit: boolean;
  enableUserRateLimit: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RequestFingerprint {
  ip: string;
  userAgent: string;
  userId?: string;
  timestamp: number;
}

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function getSecurityConfig(environment: string = 'production'): SecurityConfig {
  const isProduction = environment === 'production';
  
  return {
    allowedOrigins: isProduction 
      ? [
          'https://*.lovableproject.com',
          'https://f6fbe853-0047-490f-9d7f-c7bab9534659.lovableproject.com',
          'https://dvifibvzwunnpcsihpxq.lovableproject.com',
          'https://localhost:3000',
          'https://127.0.0.1:3000'
        ]
      : [
          'https://*.lovableproject.com',
          'https://f6fbe853-0047-490f-9d7f-c7bab9534659.lovableproject.com',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://localhost:3000'
        ],
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    enableIPRateLimit: true,
    enableUserRateLimit: true
  };
}

export function getCorsHeaders(origin: string | null, config: SecurityConfig) {
  const isAllowed = isOriginAllowed(origin, config);

  return {
    'Access-Control-Allow-Origin': isAllowed && origin ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id, x-seed-admin-token',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };
}

export function isOriginAllowed(origin: string | null, config: SecurityConfig): boolean {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    
    console.log(`[CORS Debug] Checking origin: ${origin}, hostname: ${hostname}`);
    
    const isAllowed = config.allowedOrigins.some((allowed) => {
      console.log(`[CORS Debug] Testing against allowed origin: ${allowed}`);
      
      if (allowed.includes('localhost') || allowed.includes('127.0.0.1')) {
        // Allow any scheme for localhost variants
        const match = origin.includes('localhost') || origin.includes('127.0.0.1');
        console.log(`[CORS Debug] Localhost check: ${match}`);
        return match;
      }
      
      if (allowed.startsWith('https://*.')) {
        const allowedDomain = allowed.replace('https://*.', '');
        const match = hostname === allowedDomain || hostname.endsWith('.' + allowedDomain);
        console.log(`[CORS Debug] Wildcard check for ${allowedDomain}: hostname=${hostname}, match=${match}`);
        return match;
      }
      
      const exactMatch = allowed === origin;
      console.log(`[CORS Debug] Exact match check: ${exactMatch}`);
      return exactMatch;
    });
    
    console.log(`[CORS Debug] Final result for ${origin}: ${isAllowed}`);
    return isAllowed;
  } catch (error) {
    console.error(`[CORS Debug] Error parsing origin ${origin}:`, error);
    return false;
  }
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit string length
  }
  
  if (typeof input === 'number') {
    if (!isFinite(input) || isNaN(input)) {
      throw new Error('Invalid numeric input');
    }
    return input;
  }
  
  if (Array.isArray(input)) {
    return input.slice(0, 100).map(sanitizeInput); // Limit array size
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    const allowedKeys = [
      'paymentMethodId', 'amount', 'currency', 'description', 
      'userId', 'eventId', 'ticketType', 'quantity'
    ];
    
    for (const [key, value] of Object.entries(input)) {
      if (allowedKeys.includes(key) && key.length < 50) {
        sanitized[key] = sanitizeInput(value);
      }
    }
    return sanitized;
  }
  
  return input;
}

export function validateSQLSafety(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /('|('')|;|--|\/\*|\*\/)/g,
    /(0x[0-9a-f]+)/gi
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
}

export function checkRateLimit(
  identifier: string, 
  windowMinutes: number = 1,
  maxRequests: number = 10
): { allowed: boolean; resetTime: number; remainingRequests: number } {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    
    // Cleanup old entries
    cleanupRateLimit(now - windowMs);
    
    return {
      allowed: true,
      resetTime: now + windowMs,
      remainingRequests: maxRequests - 1
    };
  }
  
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      resetTime: entry.resetTime,
      remainingRequests: 0
    };
  }
  
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    resetTime: entry.resetTime,
    remainingRequests: maxRequests - entry.count
  };
}

export function generateRequestFingerprint(req: Request): RequestFingerprint {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const userId = req.headers.get('x-user-id') || undefined;
  
  return {
    ip: ip.split(',')[0].trim(), // Get first IP from forwarded list
    userAgent: userAgent.slice(0, 200), // Limit length
    userId,
    timestamp: Date.now()
  };
}

export function detectSuspiciousActivity(fingerprint: RequestFingerprint): boolean {
  // Basic suspicious activity detection
  const suspiciousPatterns = [
    /bot|crawler|spider/i,
    /sqlmap|nmap|burp/i,
    /script|curl|wget/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(fingerprint.userAgent));
}

function cleanupRateLimit(cutoffTime: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < cutoffTime) {
      rateLimitStore.delete(key);
    }
  }
}