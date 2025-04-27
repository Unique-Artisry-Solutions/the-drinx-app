
import React from 'react';
import { Form } from "@/components/ui/form";
import { NotificationSettingsCard } from './components/NotificationSettingsCard';
import { DisplaySettingsCard } from './components/DisplaySettingsCard';
import { Button } from '@/components/ui/button';
import { usePreferencesForm } from './hooks/usePreferencesForm';

export function UserPreferencesTab() {
  // Mock user ID for demo purposes - in a real app, you'd get this from auth context
  const demoUserId = '123e4567-e89b-12d3-a456-426614174000';
  const { form, isLoading, onSubmit } = usePreferencesForm(demoUserId);

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
