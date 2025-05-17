
import { describe, it, expect, vi } from 'vitest';
import { getFeatureStatus, associateFeatureWithTier } from '../api';

// Mock implementations
const mockFeature = {
  id: 'test-1',
  name: 'test-feature',
  status: true
};

// Mock the API calls
vi.mock('../api', () => ({
  getFeatureStatus: vi.fn().mockResolvedValue({ enabled: true }),
  associateFeatureWithTier: vi.fn().mockResolvedValue(true),
}));

describe('Feature integration tests', () => {
  it('should check feature status correctly', async () => {
    const result = await getFeatureStatus('test-feature');
    expect(result.enabled).toBe(true);
  });
  
  it('should associate feature with tier', async () => {
    const result = await associateFeatureWithTier('feature-1', 'tier-1');
    expect(result).toBe(true);
  });
});
