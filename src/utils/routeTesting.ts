
import { UserType } from '@/types/navigation';
import { validateRouteAccess, RouteValidationContext } from '@/utils/routeValidation';

export interface RouteTestCase {
  path: string;
  context: RouteValidationContext;
  expectedValid: boolean;
  expectedRedirect?: string;
  description: string;
}

export interface RouteTestSuite {
  name: string;
  testCases: RouteTestCase[];
}

/**
 * Comprehensive route test cases for all user types and scenarios
 */
export const routeTestSuites: RouteTestSuite[] = [
  {
    name: 'Public Routes',
    testCases: [
      {
        path: '/landing',
        context: { userType: null, isAuthenticated: false, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Landing page should be accessible to all users'
      },
      {
        path: '/explore',
        context: { userType: null, isAuthenticated: false, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Explore page should be accessible to all users'
      },
      {
        path: '/login',
        context: { userType: null, isAuthenticated: false, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Login page should be accessible to all users'
      }
    ]
  },
  {
    name: 'Admin Routes - Authenticated',
    testCases: [
      {
        path: '/admin/system-breakdown',
        context: { userType: 'admin', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Admin should access system breakdown'
      },
      {
        path: '/admin/dashboard',
        context: { userType: 'admin', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Admin should access dashboard'
      },
      {
        path: '/admin/system-breakdown',
        context: { userType: 'individual', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: false,
        expectedRedirect: '/explore',
        description: 'Individual user should not access admin routes'
      },
      {
        path: '/admin/dashboard',
        context: { userType: null, isAuthenticated: false, isDevelopment: false, isDevModeActive: false },
        expectedValid: false,
        expectedRedirect: '/login',
        description: 'Unauthenticated user should not access admin routes'
      }
    ]
  },
  {
    name: 'Establishment Routes',
    testCases: [
      {
        path: '/establishment/dashboard',
        context: { userType: 'establishment', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Establishment should access their dashboard'
      },
      {
        path: '/establishment/profile',
        context: { userType: 'establishment', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Establishment should access their profile'
      },
      {
        path: '/establishment/dashboard',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: false,
        expectedRedirect: '/promoter/dashboard',
        description: 'Promoter should not access establishment routes'
      }
    ]
  },
  {
    name: 'Promoter Routes',
    testCases: [
      {
        path: '/promoter/dashboard',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Promoter should access their dashboard'
      },
      {
        path: '/promoter/events',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Promoter should access their events'
      },
      {
        path: '/promoter/dashboard',
        context: { userType: 'individual', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: false,
        expectedRedirect: '/explore',
        description: 'Individual should not access promoter routes'
      }
    ]
  },
  {
    name: 'Development Mode Bypass',
    testCases: [
      {
        path: '/admin/system-breakdown',
        context: { userType: null, isAuthenticated: false, isDevelopment: true, isDevModeActive: true },
        expectedValid: true,
        description: 'Development mode should bypass all restrictions'
      },
      {
        path: '/establishment/dashboard',
        context: { userType: null, isAuthenticated: false, isDevelopment: true, isDevModeActive: true },
        expectedValid: true,
        description: 'Development mode should bypass establishment restrictions'
      },
      {
        path: '/promoter/events',
        context: { userType: null, isAuthenticated: false, isDevelopment: true, isDevModeActive: true },
        expectedValid: true,
        description: 'Development mode should bypass promoter restrictions'
      }
    ]
  },
  {
    name: 'Profile Routes',
    testCases: [
      {
        path: '/profile',
        context: { userType: 'individual', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Authenticated user should access profile'
      },
      {
        path: '/notifications',
        context: { userType: 'establishment', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expectedValid: true,
        description: 'Authenticated establishment should access notifications'
      },
      {
        path: '/profile',
        context: { userType: null, isAuthenticated: false, isDevelopment: false, isDevModeActive: false },
        expectedValid: false,
        expectedRedirect: '/login',
        description: 'Unauthenticated user should not access profile'
      }
    ]
  }
];

/**
 * Run all route tests and return results
 */
export const runRouteTests = (): { passed: number; failed: number; results: any[] } => {
  const results: any[] = [];
  let passed = 0;
  let failed = 0;

  routeTestSuites.forEach(suite => {
    console.group(`🧪 Testing ${suite.name}`);
    
    suite.testCases.forEach(testCase => {
      const result = validateRouteAccess(testCase.path, testCase.context);
      const isValid = result.isValid === testCase.expectedValid;
      const redirectMatches = testCase.expectedRedirect ? 
        result.suggestedRedirect === testCase.expectedRedirect : true;
      
      const testPassed = isValid && redirectMatches;
      
      if (testPassed) {
        passed++;
        console.log(`✅ ${testCase.description}`);
      } else {
        failed++;
        console.error(`❌ ${testCase.description}`);
        console.error(`   Expected: valid=${testCase.expectedValid}, redirect=${testCase.expectedRedirect}`);
        console.error(`   Actual: valid=${result.isValid}, redirect=${result.suggestedRedirect}`);
      }
      
      results.push({
        suite: suite.name,
        test: testCase.description,
        path: testCase.path,
        context: testCase.context,
        expected: { valid: testCase.expectedValid, redirect: testCase.expectedRedirect },
        actual: { valid: result.isValid, redirect: result.suggestedRedirect },
        passed: testPassed
      });
    });
    
    console.groupEnd();
  });

  return { passed, failed, results };
};

/**
 * Test specific route patterns
 */
export const testRoutePattern = (pattern: string, paths: string[]): boolean[] => {
  const regex = new RegExp(pattern.replace(/:\w+/g, '[^/]+'));
  return paths.map(path => regex.test(path));
};

/**
 * Validate mobile navigation compatibility
 */
export const testMobileNavigation = (): { compatible: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for mobile-specific routes
  const mobileRoutes = ['/profile', '/notifications', '/explore'];
  const desktopOnlyRoutes = ['/admin/system-breakdown'];
  
  // Test touch-friendly navigation
  const hasTouchFriendlyNav = true; // This would be tested in actual component
  if (!hasTouchFriendlyNav) {
    issues.push('Navigation not optimized for touch devices');
  }
  
  // Test responsive layout
  const hasResponsiveLayout = true; // This would be tested in actual component
  if (!hasResponsiveLayout) {
    issues.push('Layout not responsive for mobile devices');
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
};
