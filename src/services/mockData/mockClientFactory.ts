
import { MockDataService } from '../MockDataService';
import { UserType } from '@/types/navigation';
import { MOCK_PROFILES, MOCK_USERS } from './mockConstants';

/**
 * Factory for creating mock Supabase client instances
 */
export class MockClientFactory {
  /**
   * Creates a mock Supabase client that returns mock data
   */
  static createMockClient() {
    const currentUserType = MockDataService.getCurrentDevUserType();
    const currentUserId = MockDataService.getCurrentDevUserId();

    console.log('[MockDB] Creating mock client for:', { currentUserType, currentUserId });

    const mockClient = {
      from: (tableName: string) => ({
        select: (columns: string = '*') => ({
          eq: (column: string, value: any) => ({
            single: async () => this.handleSingleQuery(tableName, column, value, currentUserType, currentUserId),
            maybeSingle: async () => this.handleMaybeSingleQuery(tableName, column, value, currentUserType, currentUserId),
          }),
          range: (from: number, to: number) => ({
            then: async (callback: Function) => {
              const result = await this.handleRangeQuery(tableName, from, to, currentUserType, currentUserId);
              return callback(result);
            }
          }),
          then: async (callback: Function) => {
            const result = await this.handleSelectQuery(tableName, currentUserType, currentUserId);
            return callback(result);
          }
        }),
        insert: (data: any) => ({
          select: () => ({
            then: async (callback: Function) => {
              console.log(`[MockDB] Mock insert into ${tableName}:`, data);
              const result = { data: [data], error: null };
              return callback(result);
            }
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              then: async (callback: Function) => {
                console.log(`[MockDB] Mock update in ${tableName}:`, { data, column, value });
                const result = { data: [{ ...data, [column]: value }], error: null };
                return callback(result);
              }
            })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async (callback: Function) => {
              console.log(`[MockDB] Mock delete from ${tableName}:`, { column, value });
              const result = { data: [], error: null };
              return callback(result);
            }
          })
        })
      }),

      auth: {
        getUser: async () => {
          const userType = currentUserType;
          const user = userType ? MOCK_USERS[userType] : null;
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
          
          const user = MOCK_USERS[userType];
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
        }
      },

      functions: {
        invoke: async (functionName: string, options: any) => {
          console.log(`[MockDB] Mock function call: ${functionName}`, options);
          return { data: { success: true }, error: null };
        }
      },

      rpc: async (functionName: string, params: any) => {
        console.log(`[MockDB] Mock RPC call: ${functionName}`, params);
        return { data: null, error: null };
      }
    };

    return mockClient;
  }

  private static async handleSelectQuery(tableName: string, currentUserType: UserType | null, currentUserId: string | null) {
    let mockData: any[] = [];

    switch (tableName) {
      case 'profiles':
        mockData = MOCK_PROFILES;
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
      case 'reviews':
        mockData = MockDataService.getReviews();
        break;
      case 'notifications':
        mockData = currentUserId ? MockDataService.getNotifications(currentUserId) : [];
        break;
      default:
        console.log(`[MockDB] No mock data for table: ${tableName}`);
        mockData = [];
    }

    console.log(`[MockDB] Returning ${mockData.length} records for ${tableName}`);
    return { data: mockData, error: null };
  }

  private static async handleSingleQuery(tableName: string, column: string, value: any, currentUserType: UserType | null, currentUserId: string | null) {
    const { data } = await this.handleSelectQuery(tableName, currentUserType, currentUserId);
    const record = data?.find((item: any) => item[column] === value);
    
    if (!record) {
      return { data: null, error: { message: 'No rows found' } };
    }
    
    return { data: record, error: null };
  }

  private static async handleMaybeSingleQuery(tableName: string, column: string, value: any, currentUserType: UserType | null, currentUserId: string | null) {
    const { data } = await this.handleSelectQuery(tableName, currentUserType, currentUserId);
    const record = data?.find((item: any) => item[column] === value) || null;
    
    return { data: record, error: null };
  }

  private static async handleRangeQuery(tableName: string, from: number, to: number, currentUserType: UserType | null, currentUserId: string | null) {
    const { data } = await this.handleSelectQuery(tableName, currentUserType, currentUserId);
    const slicedData = data?.slice(from, to + 1) || [];
    
    return { data: slicedData, error: null };
  }
}
