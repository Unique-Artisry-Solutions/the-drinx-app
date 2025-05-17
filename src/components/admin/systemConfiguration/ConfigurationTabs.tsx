
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { SystemSetting } from '@/components/admin/systemConfiguration/tabs/types';
import TabNavigation from './TabNavigation';
import GeneralSettingsTab from './tabs/GeneralSettingsTab';
import EmailSettingsTab from './tabs/EmailSettingsTab';
import SecuritySettingsTab from './tabs/SecuritySettingsTab';
import ApiSettingsTab from './tabs/ApiSettingsTab';
import PaymentSettingsTab from './tabs/PaymentSettingsTab';
import FeatureTogglesTab from './tabs/FeatureTogglesTab';
import FeatureTierMappingTab from './tabs/FeatureTierMappingTab';
import FeatureAnalyticsTab from './tabs/FeatureAnalyticsTab';
import EmptyState from './EmptyState';

interface ConfigurationTabsProps {
  category: string;
  setCategory: (category: string) => void;
  settings: SystemSetting[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: any;
  changeReason: string;
  onEditClick: (settingId: string, currentValue: any) => void;
  onSaveClick: (settingId: string, isProtected: boolean) => void;
  onCancelClick: () => void;
  setEditValue: (value: any) => void;
  setChangeReason: (reason: string) => void;
  error?: Error | null;
  isSubmitting?: boolean;
}

const ConfigurationTabs: React.FC<ConfigurationTabsProps> = ({
  category,
  setCategory,
  settings,
  isLoading,
  editingSettingId,
  editValue,
  changeReason,
  onEditClick,
  onSaveClick,
  onCancelClick,
  setEditValue,
  setChangeReason,
  error = null,
  isSubmitting = false,
}) => {
  // Create props object to pass to the tabs
  const settingsTabProps = {
    settings,
    isLoading,
    editingSettingId,
    editValue,
    changeReason,
    onEdit: (id: string, value: any) => onEditClick(id, value),
    onSave: async (id: string, isProtected: boolean) => {
      onSaveClick(id, isProtected);
      return Promise.resolve();
    },
    onCancel: onCancelClick,
    onEditValueChange: setEditValue,
    setChangeReason,
    isSubmitting,
    error,
    onEditClick,
    onSaveClick,
    onCancelClick,
    setEditValue
  };

  // Check if we have settings for the current category
  const hasSettingsForCategory = settings.filter(s => s.category === category).length > 0;
  const isLoadingNewCategory = isLoading && !hasSettingsForCategory;

  // Determine which tabs should show the default loading/empty state
  // Feature-related tabs should always render their components
  const isFeatureTab = ['features', 'feature-tiers', 'feature-analytics'].includes(category);

  const renderTabContent = () => {
    // Only show loading or empty state for non-feature tabs
    if (!isFeatureTab && isLoadingNewCategory) {
      return (
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center items-center">
              <Spinner size="md" />
              <span className="ml-2">Loading settings...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!isFeatureTab && !hasSettingsForCategory && !isLoading) {
      return <EmptyState category={category} />;
    }

    return null;
  };

  // Always render TabNavigation first, then the tab content
  return (
    <Tabs value={category} className="w-full" onValueChange={setCategory}>
      {/* TabNavigation always renders, even during loading or errors */}
      <TabNavigation currentCategory={category} />

      {/* Tab content */}
      <TabsContent value="general" className="space-y-4">
        {renderTabContent() || <GeneralSettingsTab {...settingsTabProps} />}
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        {renderTabContent() || <EmailSettingsTab {...settingsTabProps} />}
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        {renderTabContent() || <SecuritySettingsTab {...settingsTabProps} />}
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        {renderTabContent() || <ApiSettingsTab {...settingsTabProps} />}
      </TabsContent>
      
      <TabsContent value="payment" className="space-y-4">
        {renderTabContent() || <PaymentSettingsTab {...settingsTabProps} />}
      </TabsContent>
      
      {/* Feature tabs always render their components regardless of settings */}
      <TabsContent value="features" className="space-y-4">
        <FeatureTogglesTab {...settingsTabProps} />
      </TabsContent>

      <TabsContent value="feature-tiers" className="space-y-4">
        <FeatureTierMappingTab {...settingsTabProps} />
      </TabsContent>

      <TabsContent value="feature-analytics" className="space-y-4">
        <FeatureAnalyticsTab {...settingsTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ConfigurationTabs;
