
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { subscriptionAdapter } from '@/services/SubscriptionAdapter';

interface FeatureFlags {
  useNewFollowerSystem: boolean;
  enableRealTimeNotifications: boolean;
  enableAdvancedSegmentation: boolean;
  fallbackToLegacyOnError: boolean;
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>({
    useNewFollowerSystem: false,
    enableRealTimeNotifications: false,
    enableAdvancedSegmentation: false,
    fallbackToLegacyOnError: true
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      // Try to load from system settings table
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', [
          'follower_system_enabled',
          'realtime_notifications_enabled',
          'advanced_segmentation_enabled',
          'legacy_fallback_enabled'
        ]);

      if (!error && data) {
        const flagMap = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, any>);

        const newFlags: FeatureFlags = {
          useNewFollowerSystem: flagMap.follower_system_enabled?.enabled || false,
          enableRealTimeNotifications: flagMap.realtime_notifications_enabled?.enabled || false,
          enableAdvancedSegmentation: flagMap.advanced_segmentation_enabled?.enabled || false,
          fallbackToLegacyOnError: flagMap.legacy_fallback_enabled?.enabled ?? true
        };

        setFlags(newFlags);
        subscriptionAdapter.updateFeatureFlags(newFlags);
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFlag = async (key: keyof FeatureFlags, value: boolean) => {
    try {
      const settingKey = {
        useNewFollowerSystem: 'follower_system_enabled',
        enableRealTimeNotifications: 'realtime_notifications_enabled',
        enableAdvancedSegmentation: 'advanced_segmentation_enabled',
        fallbackToLegacyOnError: 'legacy_fallback_enabled'
      }[key];

      await supabase
        .from('system_settings')
        .upsert({
          key: settingKey,
          value: { enabled: value },
          category: 'features',
          description: `Feature flag for ${key}`
        });

      const newFlags = { ...flags, [key]: value };
      setFlags(newFlags);
      subscriptionAdapter.updateFeatureFlags(newFlags);
    } catch (error) {
      console.error('Error updating feature flag:', error);
    }
  };

  return {
    flags,
    isLoading,
    updateFlag,
    refetch: loadFeatureFlags
  };
}
