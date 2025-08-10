export function redactSensitive<T = any>(value: T): T {
  const sensitiveKeys = [
    'password', 'pass', 'secret', 'token', 'authorization', 'apiKey', 'api_key', 'access_token', 'refresh_token', 'session', 'cookie', 'card', 'cc', 'ssn'
  ];

  const redactString = (str: string): string => {
    let s = str;
    // Emails
    s = s.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]');
    // Bearer tokens
    s = s.replace(/Bearer\s+[A-Za-z0-9\-_.~+/]+=*/gi, 'Bearer [REDACTED]');
    // API keys and tokens in query/kv pairs
    s = s.replace(/(api[_-]?key|token|password|secret)=([^&\s]+)/gi, '$1=[REDACTED]');
    // Credit card-like sequences (13-19 digits)
    s = s.replace(/\b\d{13,19}\b/g, '[REDACTED_CARD]');
    return s;
  };

  const helper = (val: any): any => {
    if (val == null) return val;
    if (typeof val === 'string') return redactString(val);
    if (typeof val === 'number' || typeof val === 'boolean') return val;
    if (Array.isArray(val)) return val.map(helper);
    if (typeof val === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk))) {
          out[k] = '[REDACTED]';
        } else {
          out[k] = helper(v);
        }
      }
      return out;
    }
    return String(val);
  };

  return helper(value);
}
