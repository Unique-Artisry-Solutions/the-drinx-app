
import { supabase as realSupabase } from '@/lib/supabase';
import { MockDatabaseService } from '@/services/MockDatabaseService';

/**
 * Smart Supabase client that automatically uses mock data in dev mode
 */
class SmartSupabaseClient {
  private get shouldUseMock(): boolean {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.includes('preview--') ||
                       hostname.includes('lovable');
    
    const devModeActive = localStorage.getItem('dev_user_type') !== null;
    
    return isLocalhost && devModeActive;
  }

  private get activeClient() {
    if (this.shouldUseMock) {
      const mockClient = MockDatabaseService.createMockClient();
      if (mockClient) {
        return mockClient;
      }
    }
    return realSupabase;
  }

  // Proxy all Supabase methods to the active client
  get from() {
    return this.activeClient.from.bind(this.activeClient);
  }

  get auth() {
    return this.activeClient.auth;
  }

  get functions() {
    return this.activeClient.functions;
  }

  get rpc() {
    return this.activeClient.rpc.bind(this.activeClient);
  }

  get storage() {
    return realSupabase.storage; // Always use real storage
  }
}

// Export the smart client instance
export const supabase = new SmartSupabaseClient();

// Export utilities
export { getSessionDebug, trackAuthStateChange } from '@/integrations/supabase/client';
