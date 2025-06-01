
import React from 'react';
import { Form } from "@/components/ui/form";
import { NotificationSettingsCard } from './components/NotificationSettingsCard';
import { DisplaySettingsCard } from './components/DisplaySettingsCard';
import { Button } from '@/components/ui/button';
import { usePreferencesForm } from './hooks/usePreferencesForm';
import { PreferencesFormError } from './components/PreferencesFormError';
import { PreferencesFormSkeleton } from './components/PreferencesFormSkeleton';
import { Loader2 } from 'lucide-react';

export function UserPreferencesTab() {
  const demoUserId = '123e4567-e89b-12d3-a456-426614174000';
  const { form, isLoading, onSubmit, isSubmitting, hasError } = usePreferencesForm(demoUserId);

  if (hasError) {
    return <PreferencesFormError />;
  }

  if (isLoading) {
    return <PreferencesFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationSettingsCard form={form} />
        <DisplaySettingsCard form={form} />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
