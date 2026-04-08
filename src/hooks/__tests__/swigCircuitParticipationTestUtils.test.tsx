
import { describe, it, expect, vi } from 'vitest';
import { setupMocks, mockUser } from './utils/swigCircuitParticipationTestUtils';

describe('swigCircuitParticipationTestUtils', () => {
  it('should have the right test utilities', () => {
    // Call setupMocks to verify it works
    setupMocks();
    
    // Verify mockUser exists
    expect(mockUser).toBeDefined();
    expect(mockUser.id).toBe('test-user-id');
  });
});
