
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
  return (
    <Tabs defaultValue="general" className="w-full" onValueChange={setCategory}>
      <TabNavigation currentCategory={category} />

      <TabsContent value="general" className="space-y-4">
        <GeneralSettingsTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <EmailSettingsTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <SecuritySettingsTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        <ApiSettingsTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
      
      <TabsContent value="payment" className="space-y-4">
        <PaymentSettingsTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
      
      <TabsContent value="features" className="space-y-4">
        <FeatureTogglesTab
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ConfigurationTabs;
