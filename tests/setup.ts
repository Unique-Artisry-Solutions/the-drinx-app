import { beforeAll, afterAll } from 'vitest';

// Global test setup and teardown
beforeAll(async () => {
  console.log('🔧 Setting up global test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  
  // Any global setup needed for all tests
});

afterAll(async () => {
  console.log('🧹 Cleaning up global test environment...');
  
  // Any global cleanup needed after all tests
});

// Custom matchers or global test utilities can be added here