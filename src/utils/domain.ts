/**
 * Domain detection utility for handling cross-domain impersonation flows
 */

export interface DomainInfo {
  hostname: string;
  origin: string;
  isLovableApp: boolean;
  isLovableProject: boolean;
  projectId: string | null;
}

/**
 * Parse and detect domain information for Lovable environments
 */
export const parseDomainInfo = (url?: string): DomainInfo => {
  const targetUrl = url || window.location.href;
  
  try {
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;
    const origin = parsed.origin;
    
    // Extract project ID from hostname patterns
    let projectId: string | null = null;
    
    // Pattern: id-preview--{project-id}.lovable.app or {project-id}.lovableproject.com
    const lovableAppMatch = hostname.match(/(?:id-preview--)?([a-f0-9-]+)\.lovable\.app$/);
    const lovableProjectMatch = hostname.match(/^([a-f0-9-]+)\.lovableproject\.com$/);
    
    if (lovableAppMatch) {
      projectId = lovableAppMatch[1];
    } else if (lovableProjectMatch) {
      projectId = lovableProjectMatch[1];
    }
    
    return {
      hostname,
      origin,
      isLovableApp: hostname.includes('lovable.app'),
      isLovableProject: hostname.includes('lovableproject.com'),
      projectId
    };
  } catch (e) {
    console.error('Failed to parse domain info:', e);
    return {
      hostname: window.location.hostname,
      origin: window.location.origin,
      isLovableApp: false,
      isLovableProject: false,
      projectId: null
    };
  }
};

/**
 * Check if two domains are in the same project (cross-domain compatible)
 */
export const isSameProject = (domain1: string, domain2: string): boolean => {
  const info1 = parseDomainInfo(domain1);
  const info2 = parseDomainInfo(domain2);
  
  return !!(info1.projectId && info2.projectId && info1.projectId === info2.projectId);
};

/**
 * Get the preferred domain format for the current environment
 */
export const getPreferredDomain = (): 'lovable.app' | 'lovableproject.com' | 'unknown' => {
  const info = parseDomainInfo();
  
  if (info.isLovableApp) return 'lovable.app';
  if (info.isLovableProject) return 'lovableproject.com';
  return 'unknown';
};