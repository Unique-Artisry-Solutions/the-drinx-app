
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SystemSetting } from '@/types/SupabaseTables';
import TabNavigation from './TabNavigation';
import GeneralSettingsTab from './tabs/GeneralSettingsTab';
import EmailSettingsTab from './tabs/EmailSettingsTab';
import SecuritySettingsTab from './tabs/SecuritySettingsTab';
import ApiSettingsTab from './tabs/ApiSettingsTab';
import PaymentSettingsTab from './tabs/PaymentSettingsTab';
import FeatureTogglesTab from './tabs/FeatureTogglesTab';
import FeatureTierMappingTab from './tabs/FeatureTierMappingTab';
import FeatureAnalyticsTab from './tabs/FeatureAnalyticsTab';

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
}) => {
  // Create props object to pass to the tabs
  const settingsTabProps = {
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
  };

  return (
    <Tabs defaultValue="general" className="w-full" onValueChange={setCategory}>
      <TabNavigation currentCategory={category} />

      <TabsContent value="general" className="space-y-4">
        <GeneralSettingsTab {...settingsTabProps} />
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <EmailSettingsTab {...settingsTabProps} />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <SecuritySettingsTab {...settingsTabProps} />
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        <ApiSettingsTab {...settingsTabProps} />
      </TabsContent>
      
      <TabsContent value="payment" className="space-y-4">
        <PaymentSettingsTab {...settingsTabProps} />
      </TabsContent>
      
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
