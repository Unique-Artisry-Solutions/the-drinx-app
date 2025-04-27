
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserPreferences, updateUserPreference } from '@/lib/rewards/api/preferences';
import { preferencesSchema, type PreferencesFormData } from '../types';

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
    queryFn: () => getUserPreferences(userId),
    retry: 2
  });

  React.useEffect(() => {
    if (fetchError) {
      console.error('Failed to fetch user preferences:', fetchError);
      toast.error('Unable to load preferences. Please try again later.');
    }
  }, [fetchError]);

  React.useEffect(() => {
    if (preferences) {
      try {
        const formattedPreferences = preferences.reduce((acc, pref) => {
          try {
            if (pref.preference_key === 'notification_settings') {
              acc.notification_settings = JSON.parse(pref.preference_value);
            } else if (pref.preference_key === 'display_settings') {
              acc.display_settings = JSON.parse(pref.preference_value);
            }
          } catch (parseError) {
            console.error(`Error parsing ${pref.preference_key}:`, parseError);
            toast.error(`Invalid preference format for ${pref.preference_key}`);
          }
          return acc;
        }, {} as PreferencesFormData);

        if (formattedPreferences.notification_settings && formattedPreferences.display_settings) {
          form.reset(formattedPreferences);
        } else {
          console.warn('Incomplete preference data:', formattedPreferences);
          toast.error('Some preferences could not be loaded');
        }
      } catch (error) {
        console.error('Error formatting preferences:', error);
        toast.error('Failed to process preferences data');
      }
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferencesFormData) => {
    console.log('Updating preferences:', data);
    
    try {
      const updatePromises = [
        updateUserPreference(userId, 'notification_settings', JSON.stringify(data.notification_settings))
          .catch(error => {
            console.error('Failed to update notification settings:', error);
            throw new Error('Failed to update notification settings');
          }),
        updateUserPreference(userId, 'display_settings', JSON.stringify(data.display_settings))
          .catch(error => {
            console.error('Failed to update display settings:', error);
            throw new Error('Failed to update display settings');
          })
      ];

      await Promise.all(updatePromises);
      console.log('Successfully updated all preferences');
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update preferences');
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    hasError: !!fetchError
  };
};
