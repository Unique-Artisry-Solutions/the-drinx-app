
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';

export function useEdgeFunctionHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const checkHealth = useCallback(async () => {
    try {
      setIsChecking(true);
      setError(null);
      
      console.log('Checking edge function health...');
      
      const response = await supabase.functions.invoke('notifications', {
        body: {
          action: 'healthCheck'
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Health check failed');
      }
      
      console.log('Edge function health check result:', response);
      setIsHealthy(true);
      setLastCheck(new Date());
      return true;
    } catch (err) {
      console.error('Edge function health check failed:', err);
      setIsHealthy(false);
      setError(err instanceof Error ? err.message : 'Health check failed');
      setLastCheck(new Date());
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  const runTestRequest = useCallback(async () => {
    try {
      setIsChecking(true);
      console.log('Running test request...');
      
      const response = await supabase.functions.invoke('notifications', {
        body: {
          action: 'testPushNotification',
          params: {
            userId: 'test-user'
          }
        }
      });
      
      console.log('Test request result:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Test request failed');
      }
      
      debouncedToast.success(
        "Edge Function Working",
        "Test request completed successfully"
      );
      
      setIsHealthy(true);
      setLastCheck(new Date());
      return true;
    } catch (err) {
      console.error('Test request failed:', err);
      setError(err instanceof Error ? err.message : 'Test request failed');
      
      debouncedToast.error(
        "Edge Function Error",
        err instanceof Error ? err.message : 'Test request failed'
      );
      
      setIsHealthy(false);
      setLastCheck(new Date());
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  useEffect(() => {
    const init = async () => {
      await checkHealth();
    };
    
    init();
  }, [checkHealth]);
  
  return {
    isHealthy,
    isChecking,
    lastCheck,
    error,
    checkHealth,
    runTestRequest
  };
}
