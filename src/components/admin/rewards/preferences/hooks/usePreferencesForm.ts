
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rewardsApi } from '@/lib/rewards/api';
import { preferencesSchema, type PreferencesFormData } from '../types';
import { apiToComponentPreferences } from '@/lib/adapters/rewardAdapters';

export const usePreferencesForm = (userId: string) => {
  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notification_settings: {
        point_changes: true,
        tier_updates: true,
        reward_availability: true
      },
      display_settings: {
        points_format: 'standard',
        show_tier_progress: true
      }
    }
  });

  const { data: preferences, isLoading, error: fetchError } = useQuery({
    queryKey: ['rewardPreferences', userId],
    queryFn: async () => {
      // Get all preference keys we need using the adapter pattern
      const notificationSettings = await rewardsApi.getUserPreference(userId, 'notification_settings');
      const displaySettings = await rewardsApi.getUserPreference(userId, 'display_settings');
      
      // Return the API preferences (will be transformed in useEffect)
      return { notificationSettings, displaySettings };
    },
    retry: 2
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PreferencesFormData) => {
      const updatePromises = [
        rewardsApi.setUserPreference(userId, 'notification_settings', data.notification_settings),
        rewardsApi.setUserPreference(userId, 'display_settings', data.display_settings)
      ];
      await Promise.all(updatePromises);
    },
    onSuccess: () => {
      toast.success('Preferences updated successfully');
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences. Please try again.');
    }
  });

  React.useEffect(() => {
    if (fetchError) {
      console.error('Failed to fetch user preferences:', fetchError);
      toast.error('Unable to load preferences. Please try again later.');
    }
  }, [fetchError]);

  React.useEffect(() => {
    if (preferences?.notificationSettings && preferences?.displaySettings) {
      try {
        // Transform API preferences to component preferences
        const componentPrefs = apiToComponentPreferences(
          preferences.notificationSettings,
          preferences.displaySettings
        );

        // Transform to form data format
        const formData: PreferencesFormData = {
          notification_settings: {
            point_changes: componentPrefs.notificationSettings.pointChanges,
            tier_updates: componentPrefs.notificationSettings.tierUpdates,
            reward_availability: componentPrefs.notificationSettings.rewardAvailability
          },
          display_settings: {
            points_format: componentPrefs.displaySettings.pointsFormat,
            show_tier_progress: componentPrefs.displaySettings.showTierProgress
          }
        };

        form.reset(formData);
      } catch (error) {
        console.error('Error transforming preferences:', error);
        toast.error('Failed to process preferences data');
      }
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferencesFormData) => {
    updateMutation.mutate(data);
  };

  return {
    form,
    isLoading,
    onSubmit,
    isSubmitting: updateMutation.isPending,
    hasError: !!fetchError
  };
};
