
import { MockDataService } from './MockDataService';
import { UserType } from '@/types/navigation';

/**
 * Mock Database Service
 * Intercepts Supabase queries in dev mode and returns mock data
 */

interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  neq: (column: string, value: any) => MockQueryBuilder;
  in: (column: string, values: any[]) => MockQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  single: () => Promise<{ data: any; error: null }>;
  maybeSingle: () => Promise<{ data: any; error: null }>;
  then: (callback: (result: { data: any[]; error: null }) => any) => Promise<any>;
}

class MockQueryBuilderImpl implements MockQueryBuilder {
  private tableName: string;
  private mockData: any[];
  private filters: Array<{ column: string; operator: string; value: any }> = [];
  private selectedColumns?: string;
  private orderConfig?: { column: string; ascending: boolean };
  private limitCount?: number;

  constructor(tableName: string, mockData: any[]) {
    this.tableName = tableName;
    this.mockData = mockData;
  }

  select(columns?: string): MockQueryBuilder {
    this.selectedColumns = columns;
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: any): MockQueryBuilder {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  in(column: string, values: any[]): MockQueryBuilder {
    this.filters.push({ column, operator: 'in', value: values });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder {
    this.orderConfig = { column, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number): MockQueryBuilder {
    this.limitCount = count;
    return this;
  }

  private processData(): any[] {
    let result = [...this.mockData];

    // Apply filters
    this.filters.forEach(filter => {
      result = result.filter(item => {
        const itemValue = item[filter.column];
        switch (filter.operator) {
          case 'eq':
            return itemValue === filter.value;
          case 'neq':
            return itemValue !== filter.value;
          case 'in':
            return filter.value.includes(itemValue);
          default:
            return true;
        }
      });
    });

    // Apply ordering
    if (this.orderConfig) {
      result.sort((a, b) => {
        const aVal = a[this.orderConfig!.column];
        const bVal = b[this.orderConfig!.column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.orderConfig!.ascending ? comparison : -comparison;
      });
    }

    // Apply limit
    if (this.limitCount) {
      result = result.slice(0, this.limitCount);
    }

    return result;
  }

  async single(): Promise<{ data: any; error: null }> {
    const processed = this.processData();
    return { data: processed[0] || null, error: null };
  }

  async maybeSingle(): Promise<{ data: any; error: null }> {
    const processed = this.processData();
    return { data: processed[0] || null, error: null };
  }

  async then(callback: (result: { data: any[]; error: null }) => any): Promise<any> {
    const processed = this.processData();
    return callback({ data: processed, error: null });
  }
}

export class MockDatabaseService {
  /**
   * Create a mock Supabase client that returns mock data in dev mode
   */
  static createMockClient() {
    const shouldUseMock = MockDataService.shouldUseMockData();
    
    if (!shouldUseMock) {
      return null; // Return null to use real Supabase client
    }

    const currentUserType = MockDataService.getCurrentDevUserType();
    const currentUserId = MockDataService.getCurrentDevUserId();

    return {
      from: (tableName: string) => {
        console.log(`[MockDB] Intercepting query to table: ${tableName}`);
        
        let mockData: any[] = [];

        switch (tableName) {
          case 'profiles':
            mockData = MockDataService.MOCK_PROFILES;
            break;
          case 'establishments':
            mockData = MockDataService.getEstablishments(currentUserType || undefined, currentUserId || undefined);
            break;
          case 'cocktails':
            mockData = MockDataService.getCocktails();
            break;
          case 'events':
            mockData = MockDataService.getEvents(currentUserType || undefined, currentUserId || undefined);
            break;
          case 'swig_circuits':
            mockData = MockDataService.getSwigCircuits(currentUserId || undefined);
            break;
          case 'cocktail_reviews':
            mockData = MockDataService.getReviews();
            break;
          case 'notifications':
            mockData = MockDataService.getNotifications(currentUserId || '');
            break;
          case 'user_rewards':
            mockData = [{
              id: 'reward-001',
              user_id: currentUserId,
              points: 150,
              lifetime_points: 450,
              current_tier_id: 'tier-001',
              establishment_id: null,
              created_at: new Date().toISOString()
            }];
            break;
          case 'reward_tiers':
            mockData = [
              {
                id: 'tier-001',
                name: 'Bronze',
                points_required: 0,
                establishment_id: null,
                benefits: ['5% discount', 'Birthday reward'],
                is_active: true
              },
              {
                id: 'tier-002',
                name: 'Silver',
                points_required: 500,
                establishment_id: null,
                benefits: ['10% discount', 'Birthday reward', 'Early access'],
                is_active: true
              }
            ];
            break;
          default:
            mockData = [];
        }

        return new MockQueryBuilderImpl(tableName, mockData);
      },

      auth: {
        getUser: async () => {
          const userType = currentUserType;
          const user = userType ? MockDataService.MOCK_USERS[userType] : null;
          return { 
            data: { user }, 
            error: null 
          };
        },
        
        getSession: async () => {
          const userType = currentUserType;
          if (!userType) {
            return { data: { session: null }, error: null };
          }
          
          const user = MockDataService.MOCK_USERS[userType];
          const session = {
            access_token: `mock-token-${userType}`,
            refresh_token: `mock-refresh-${userType}`,
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer',
            user
          };
          
          return { 
            data: { session }, 
            error: null 
          };
        },

        onAuthStateChange: (callback: Function) => {
          // Mock auth state change subscription
          return {
            data: {
              subscription: {
                unsubscribe: () => console.log('[MockDB] Unsubscribed from auth changes')
              }
            }
          };
        }
      },

      functions: {
        invoke: async (functionName: string, options?: any) => {
          console.log(`[MockDB] Intercepting function call: ${functionName}`, options);
          
          switch (functionName) {
            case 'notifications':
              if (options?.body?.action === 'getNotifications') {
                return {
                  data: {
                    data: MockDataService.getNotifications(currentUserId || '')
                  },
                  error: null
                };
              }
              break;
            default:
              return { data: null, error: null };
          }
          
          return { data: null, error: null };
        }
      },

      rpc: async (functionName: string, params: any) => {
        console.log(`[MockDB] Intercepting RPC call: ${functionName}`, params);
        
        switch (functionName) {
          case 'update_user_points':
            return { data: null, error: null };
          case 'get_user_streaks':
            return { 
              data: [
                {
                  streak_type: 'daily_check_in',
                  current_count: 5,
                  longest_count: 12,
                  is_active: true,
                  next_milestone: 7,
                  next_milestone_reward: 50
                }
              ], 
              error: null 
            };
          default:
            return { data: null, error: null };
        }
      }
    };
  }

  /**
   * Log mock database activity for debugging
   */
  static logActivity(tableName: string, operation: string, data?: any) {
    if (MockDataService.shouldUseMockData()) {
      console.log(`[MockDB] ${operation} on ${tableName}`, data);
    }
  }
}
