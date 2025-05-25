
import { validateRouteAccess, RouteValidationContext } from './routeValidation';

interface TestCase {
  name: string;
  path: string;
  context: RouteValidationContext;
  expected: {
    valid: boolean;
    redirect?: string;
  };
}

export const routeTestSuites = [
  {
    name: 'Admin Routes',
    tests: [
      {
        name: 'Admin system breakdown access',
        path: '/admin/system-breakdown',
        context: { userType: 'admin', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expected: { valid: true }
      },
      {
        name: 'Admin dashboard access',
        path: '/admin/dashboard',
        context: { userType: 'admin', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expected: { valid: true }
      }
    ]
  },
  {
    name: 'Promoter Routes',
    tests: [
      {
        name: 'Promoter dashboard access',
        path: '/promoter/dashboard',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expected: { valid: true }
      },
      {
        name: 'Promoter events access',
        path: '/promoter/events',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: false, isDevModeActive: false },
        expected: { valid: true }
      }
    ]
  },
  {
    name: 'Development Bypass',
    tests: [
      {
        name: 'Dev mode admin bypass',
        path: '/admin/system-breakdown',
        context: { userType: 'admin', isAuthenticated: true, isDevelopment: true, isDevModeActive: true },
        expected: { valid: true }
      },
      {
        name: 'Dev mode promoter bypass',
        path: '/promoter/dashboard',
        context: { userType: 'promoter', isAuthenticated: true, isDevelopment: true, isDevModeActive: true },
        expected: { valid: true }
      }
    ]
  }
];

export const runRouteTests = () => {
  const results: any[] = [];
  let passed = 0;
  let failed = 0;

  routeTestSuites.forEach(suite => {
    suite.tests.forEach(test => {
      const result = validateRouteAccess(test.path, test.context as RouteValidationContext);
      const testPassed = result.isValid === test.expected.valid;
      
      if (testPassed) {
        passed++;
      } else {
        failed++;
      }

      results.push({
        suite: suite.name,
        test: test.name,
        path: test.path,
        context: test.context,
        expected: test.expected,
        actual: { valid: result.isValid, redirect: result.suggestedRedirect },
        passed: testPassed
      });
    });
  });

  return { results, passed, failed };
};

export const testMobileNavigation = () => {
  // Mock mobile compatibility test
  const issues: string[] = [];
  
  // Check if navigation elements are mobile-friendly
  const viewport = window.innerWidth;
  if (viewport < 768) {
    // Add mobile-specific tests here
  }
  
  return {
    compatible: issues.length === 0,
    issues
  };
};
