
import { MockDataService } from './MockDataService';
import { MockClientFactory } from './mockData/mockClientFactory';

/**
 * Mock Database Service
 * Provides database operation mocking for development mode
 */
export class MockDatabaseService {
  /**
   * Creates a mock Supabase client that returns mock data instead of making real API calls
   */
  static createMockClient() {
    if (!MockDataService.shouldUseMockData()) {
      console.log('[MockDB] Mock mode not active, returning null');
      return null;
    }

    try {
      return MockClientFactory.createMockClient();
    } catch (error) {
      console.error('[MockDB] Error creating mock client:', error);
      return null;
    }
  }

  /**
   * Check if mock database should be used
   */
  static shouldUseMockDatabase(): boolean {
    return MockDataService.shouldUseMockData();
  }

  /**
   * Get current development user context
   */
  static getCurrentContext() {
    return {
      userType: MockDataService.getCurrentDevUserType(),
      userId: MockDataService.getCurrentDevUserId(),
      isMockMode: MockDataService.shouldUseMockData()
    };
  }
}
