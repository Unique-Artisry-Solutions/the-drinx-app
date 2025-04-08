
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { SystemSetting, SystemSettingCategory } from '@/types/SystemSettingsTypes';
import SettingItem from './SettingItem';
import SettingsTable from './SettingsTable';
import { Loader2, AlertTriangle } from 'lucide-react';

const categoryLabels: Record<SystemSettingCategory, string> = {
  general: 'General',
  features: 'Feature Flags',
  notifications: 'Notifications',
  analytics: 'Analytics',
  security: 'Security',
  moderation: 'Content Moderation'
};

interface SystemSettingsPanelProps {
  mode?: 'compact' | 'full';
  showTitle?: boolean;
}

const SystemSettingsPanel: React.FC<SystemSettingsPanelProps> = ({
  mode = 'full',
  showTitle = true
}) => {
  const { settings, loading, error, updateSetting } = useSystemSettings();
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // Get unique categories
  const categories = [...new Set(settings.map(s => s.category))].sort();
  
  if (loading) {
    return (
      <Card className="min-h-[300px] w-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading system settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="min-h-[200px] w-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'compact') {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure application-wide settings
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {settings
              .filter(s => s.category === 'features' || s.category === 'general')
              .map(setting => (
                <SettingItem
                  key={setting.id}
                  setting={setting}
                  onUpdate={updateSetting}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure application-wide settings and feature flags
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {categoryLabels[category as SystemSettingCategory]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <SettingsTable 
                settings={settings.filter(s => s.category === category)} 
                onUpdateSetting={updateSetting}
                categoryLabel={categoryLabels[category as SystemSettingCategory]}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemSettingsPanel;
