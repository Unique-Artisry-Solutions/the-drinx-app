
import { useEffect, useState } from 'react';
import { MockDatabaseService } from '@/services/MockDatabaseService';
import { MockDataService } from '@/services/MockDataService';
import { supabase as realSupabase } from '@/lib/supabase';

/**
 * Hook that provides either real or mock Supabase client based on dev mode
 */
export const useMockDatabase = () => {
  const [mockClient, setMockClient] = useState<any>(null);
  const [shouldUseMock, setShouldUseMock] = useState(false);

  useEffect(() => {
    const checkMockMode = () => {
      const useMock = MockDataService.shouldUseMockData();
      setShouldUseMock(useMock);
      
      if (useMock) {
        const client = MockDatabaseService.createMockClient();
        setMockClient(client);
        console.log('[MockDB] Using mock database client');
      } else {
        setMockClient(null);
        console.log('[MockDB] Using real Supabase client');
      }
    };

    checkMockMode();

    // Listen for dev mode changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dev_user_type') {
        checkMockMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Return either mock or real client
  const client = shouldUseMock && mockClient ? mockClient : realSupabase;
  
  return {
    supabase: client,
    isMockMode: shouldUseMock,
    mockClient,
    realClient: realSupabase
  };
};

export default useMockDatabase;
