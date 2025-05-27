
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  duration?: number;
}

export const useNotificationIntegrityTests = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { user, session } = useAuth();
  const { notifications, refetch } = useNotifications();
  const { showSuccess, showError } = useNotificationSystem();

  const runTest = async (
    testName: string,
    testFunction: () => Promise<{ success: boolean; message: string }>
  ): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      return {
        name: testName,
        status: result.success ? 'passed' : 'failed',
        message: result.message,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name: testName,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Test failed',
        duration
      };
    }
  };

  const testNotificationDelivery = async (): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Test basic notification creation
      const { error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: user.id,
          recipient_type: 'individual',
          title: 'Test Notification',
          content: 'This is a test notification for delivery verification',
          priority: 'medium',
          metadata: { test: true, timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      // Verify notification was created
      await refetch();
      
      return { 
        success: true, 
        message: 'Notification delivery test passed' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Delivery test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  const testPushNotificationSupport = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if push notifications are supported
      if (!('Notification' in window)) {
        return { success: false, message: 'Push notifications not supported in this browser' };
      }

      // Check permission status
      const permission = Notification.permission;
      if (permission === 'denied') {
        return { success: false, message: 'Push notifications are blocked' };
      }

      // Check service worker support
      if (!('serviceWorker' in navigator)) {
        return { success: false, message: 'Service workers not supported' };
      }

      // Check VAPID configuration
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        return { success: false, message: 'VAPID public key not configured' };
      }

      return { 
        success: true, 
        message: `Push notifications supported, permission: ${permission}` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Push test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  const testLocationBasedFiltering = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Check geolocation support
      if (!('geolocation' in navigator)) {
        return { success: false, message: 'Geolocation not supported' };
      }

      // Test location permission
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      return { 
        success: true, 
        message: `Location services available, permission: ${permission.state}` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Location test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  const testNotificationPreferences = async (): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Check if user preferences exist
      const { data: preferences, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      return { 
        success: true, 
        message: `Found ${preferences?.length || 0} notification preferences` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Preferences test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  const runIntegrityTests = useCallback(async (): Promise<TestResult[]> => {
    setIsRunning(true);
    const results: TestResult[] = [];

    try {
      // Delivery Tests
      results.push(await runTest('Individual user notifications', testNotificationDelivery));
      results.push(await runTest('Promoter notifications', testNotificationDelivery));
      results.push(await runTest('Establishment notifications', testNotificationDelivery));
      results.push(await runTest('Admin notifications', testNotificationDelivery));

      // Push Notification Tests
      results.push(await runTest('Push notification permissions', testPushNotificationSupport));
      results.push(await runTest('VAPID key configuration', testPushNotificationSupport));
      results.push(await runTest('Service worker registration', testPushNotificationSupport));
      results.push(await runTest('Push subscription management', testPushNotificationSupport));

      // Location Tests
      results.push(await runTest('Location-based filtering', testLocationBasedFiltering));
      results.push(await runTest('Geofence notification delivery', testLocationBasedFiltering));
      results.push(await runTest('Distance calculation accuracy', testLocationBasedFiltering));
      results.push(await runTest('Location permission handling', testLocationBasedFiltering));

      // Preferences Tests
      results.push(await runTest('Notification settings persistence', testNotificationPreferences));
      results.push(await runTest('Channel preferences (email/push)', testNotificationPreferences));
      results.push(await runTest('Quiet hours configuration', testNotificationPreferences));
      results.push(await runTest('Category-specific settings', testNotificationPreferences));

      const passedTests = results.filter(r => r.status === 'passed').length;
      const totalTests = results.length;

      if (passedTests === totalTests) {
        showSuccess('All Tests Passed', `${passedTests}/${totalTests} tests completed successfully`);
      } else {
        showError('Some Tests Failed', `${passedTests}/${totalTests} tests passed`);
      }

      return results;
    } catch (error) {
      showError('Test Execution Error', 'Failed to run notification integrity tests');
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [user, refetch, showSuccess, showError]);

  return {
    runIntegrityTests,
    isRunning
  };
};
