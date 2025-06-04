
import { useEffect, useState } from 'react';
import { MockDataService } from '@/services/MockDataService';
import { supabase as realSupabase } from '@/lib/supabase';

/**
 * Hook that provides either real or mock Supabase client based on dev mode
 */
export const useMockDatabase = () => {
  const [shouldUseMock, setShouldUseMock] = useState(false);

  useEffect(() => {
    const checkMockMode = () => {
      const useMock = MockDataService.shouldUseMockData();
      setShouldUseMock(useMock);
      
      if (useMock) {
        console.log('[MockDB] Using mock database mode');
      } else {
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

  // Return either mock mode flag or real client
  const client = realSupabase;
  
  return {
    supabase: client,
    isMockMode: shouldUseMock,
    mockClient: null, // No longer providing mock client
    realClient: realSupabase
  };
};

export default useMockDatabase;
