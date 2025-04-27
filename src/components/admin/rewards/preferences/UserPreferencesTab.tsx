
import React from 'react';
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getUserPreferences, updateUserPreference } from '@/lib/rewards/api/preferences';
import { NotificationSettingsCard } from './components/NotificationSettingsCard';
import { DisplaySettingsCard } from './components/DisplaySettingsCard';
import { preferencesSchema, type PreferencesFormData } from './types';
import { Button } from '@/components/ui/button';

export function UserPreferencesTab() {
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

  // Mock user ID for demo purposes - in a real app, you'd get this from auth context
  const demoUserId = '123e4567-e89b-12d3-a456-426614174000';

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['rewardPreferences', demoUserId],
    queryFn: () => getUserPreferences(demoUserId),
  });

  React.useEffect(() => {
    if (preferences) {
      const formattedPreferences = preferences.reduce((acc, pref) => {
        if (pref.preference_key === 'notification_settings') {
          acc.notification_settings = pref.preference_value;
        } else if (pref.preference_key === 'display_settings') {
          acc.display_settings = pref.preference_value;
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
      await updateUserPreference(demoUserId, 'notification_settings', data.notification_settings);
      await updateUserPreference(demoUserId, 'display_settings', data.display_settings);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationSettingsCard form={form} />
        <DisplaySettingsCard form={form} />
        <div className="flex justify-end">
          <Button type="submit">Save Preferences</Button>
        </div>
      </form>
    </Form>
  );
}
