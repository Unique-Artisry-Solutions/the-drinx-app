
import { vi } from 'vitest';
import { 
  BarCrawlRepositoryFactory, 
  RepositoryType 
} from '@/repositories/RepositoryFactory';
import { MockBarCrawlParticipationRepository } from '@/repositories/mock/MockBarCrawlParticipationRepository';

/**
 * Setup mock repositories for testing
 */
export const setupMockBarCrawlRepositories = () => {
  // Create a mock repository
  const mockBarCrawlParticipationRepo = new MockBarCrawlParticipationRepository();
  
  // Set the repository type to MOCK
  BarCrawlRepositoryFactory.setRepositoryType(RepositoryType.MOCK);
  
  // Set the mock repository
  BarCrawlRepositoryFactory.setMockRepository('barCrawlParticipation', mockBarCrawlParticipationRepo);
  
  // Return the mock repository for additional configuration in tests
  return {
    mockBarCrawlParticipationRepo
  };
};

/**
 * Clean up mock repositories after testing
 */
export const cleanupMockBarCrawlRepositories = () => {
  // Reset to default repository type
  BarCrawlRepositoryFactory.setRepositoryType(RepositoryType.SUPABASE);
};
