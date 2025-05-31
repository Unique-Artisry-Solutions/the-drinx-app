
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisplaySettingsCard } from './components/DisplaySettingsCard';
import { NotificationSettingsCard } from './components/NotificationSettingsCard';
import { PreferencesFormSkeleton } from './components/PreferencesFormSkeleton';
import { PreferencesFormError } from './components/PreferencesFormError';

export function UserPreferencesTab() {
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <PreferencesFormSkeleton />;
  }

  if (error) {
    return <PreferencesFormError error={error} onRetry={() => setError(null)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Configure system-wide user preference settings and defaults.
          </p>
        </CardContent>
      </Card>

      <DisplaySettingsCard />
      <NotificationSettingsCard />
    </div>
  );
}
