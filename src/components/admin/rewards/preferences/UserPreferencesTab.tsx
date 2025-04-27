
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bell, Settings } from "lucide-react";
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getUserPreferences, updateUserPreference } from '@/lib/rewards/api/preferences';

const preferencesSchema = z.object({
  notification_settings: z.object({
    point_changes: z.boolean(),
    tier_updates: z.boolean(),
    reward_availability: z.boolean()
  }),
  display_settings: z.object({
    points_format: z.enum(['standard', 'compact']),
    show_tier_progress: z.boolean(),
  })
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

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

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['rewardPreferences'],
    queryFn: () => getUserPreferences(),
  });

  React.useEffect(() => {
    if (preferences) {
      form.reset(preferences);
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      await updateUserPreference('notification_settings', data.notification_settings);
      await updateUserPreference('display_settings', data.display_settings);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notification_settings.point_changes"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Point Change Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications when your points balance changes
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notification_settings.tier_updates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Tier Update Notifications</FormLabel>
                    <FormDescription>
                      Get notified when you reach a new reward tier
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notification_settings.reward_availability"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Reward Availability</FormLabel>
                    <FormDescription>
                      Receive notifications about new available rewards
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="display_settings.points_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Display Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select points format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard (1,234)</SelectItem>
                      <SelectItem value="compact">Compact (1.2K)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how points are displayed throughout the system
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_settings.show_tier_progress"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Show Tier Progress</FormLabel>
                    <FormDescription>
                      Display progress towards next reward tier
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
