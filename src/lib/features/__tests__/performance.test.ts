
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFeatureStatus } from '../api';

// Mock the API module
vi.mock('../api', () => ({
  getFeatureStatus: vi.fn().mockResolvedValue({ enabled: true }),
}));

describe('Feature performance tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should measure performance of feature access checks', async () => {
    const start = performance.now();
    
    // Perform multiple feature checks in a loop
    for (let i = 0; i < 100; i++) {
      await getFeatureStatus(`test-feature-${i}`);
    }
    
    const end = performance.now();
    const duration = end - start;
    
    console.log(`Performance test completed in ${duration}ms`);
    expect(duration).toBeLessThan(5000); // Example threshold
  });
  
  // Fix: Call getFeatureStatus with correct arguments
  it('should have minimal overhead for multiple checks', async () => {
    // Fix: Use correct parameters
    await getFeatureStatus('feature-1');
    await getFeatureStatus('feature-2');
    
    expect(getFeatureStatus).toHaveBeenCalledTimes(2);
  });
});
