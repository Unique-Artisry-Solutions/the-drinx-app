
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

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['rewardPreferences', userId],
    queryFn: () => getUserPreferences(userId),
  });

  // Format the preferences data when it's loaded
  React.useEffect(() => {
    if (preferences) {
      const formattedPreferences = preferences.reduce((acc, pref) => {
        if (pref.preference_key === 'notification_settings') {
          acc.notification_settings = JSON.parse(pref.preference_value);
        } else if (pref.preference_key === 'display_settings') {
          acc.display_settings = JSON.parse(pref.preference_value);
        }
        return acc;
      }, {} as PreferencesFormData);

      if (formattedPreferences.notification_settings && formattedPreferences.display_settings) {
        form.reset(formattedPreferences);
      }
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      await updateUserPreference(userId, 'notification_settings', JSON.stringify(data.notification_settings));
      await updateUserPreference(userId, 'display_settings', JSON.stringify(data.display_settings));
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  return {
    form,
    isLoading,
    onSubmit
  };
};
