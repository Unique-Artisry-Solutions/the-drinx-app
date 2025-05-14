
import { BreadcrumbItem } from '@/types/navigation/BreadcrumbTypes';

/**
 * Determines if breadcrumbs should be shown for a given path
 */
export function shouldShowBreadcrumbs(pathname: string): boolean {
  // List of paths where breadcrumbs should not be shown
  const excludedPaths = [
    '/', 
    '/landing', 
    '/login', 
    '/signup', 
    '/mission', 
    '/pricing',
    '/map', 
    '/explore',
    '/admin/login'
  ];
  
  // Don't show breadcrumbs on excluded paths
  if (excludedPaths.includes(pathname)) {
    return false;
  }
  
  return true;
}

/**
 * Transforms route segments into human-readable labels
 */
export function getSegmentLabel(segment: string): string {
  // Handle empty segment
  if (!segment) return 'Home';
  
  // Handle special cases
  switch (segment.toLowerCase()) {
    case 'admin': return 'Admin';
    case 'establishment': return 'Establishment';
    case 'promoter': return 'Promoter';
    case 'dashboard': return 'Dashboard';
    case 'cocktails': return 'Cocktails';
    case 'explore': return 'Explore';
    case 'profile': return 'Profile';
    case 'settings': return 'Settings';
    case 'analytics': return 'Analytics';
    case 'system-breakdown': return 'System Breakdown';
    case 'rewards': return 'Rewards';
    default:
      // Capitalize and format other segments
      return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}

/**
 * Builds breadcrumb items from a URL path
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Don't build breadcrumbs for the home page
  if (pathname === '/') {
    return [];
  }
  
  // Split path into segments and remove empty segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Always start with home
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];
  
  // Build up breadcrumbs by adding each segment
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Special case for IDs and dynamic segments
    const isLastSegment = index === segments.length - 1;
    const isLikelyId = segment.length > 20 || segment.match(/^[0-9]+$/);
    
    // Skip adding breadcrumb for likely IDs unless it's the last segment
    if (!isLikelyId || isLastSegment) {
      breadcrumbs.push({
        label: getSegmentLabel(segment),
        href: currentPath
      });
    }
  });
  
  return breadcrumbs;
}
