
import React, { useState } from 'react';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import ConfigurationTabs from '@/components/admin/systemConfiguration/ConfigurationTabs';

const SystemConfigurationPage: React.FC = () => {
  const [category, setCategory] = useState<string>('general');
  const { 
    settings, 
    isLoading, 
    updateSetting
  } = useSystemConfiguration({ 
    category,
    initialFetch: true
  });

  // State to track edited settings
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [changeReason, setChangeReason] = useState<string>('');

  const handleEditClick = (settingId: string, currentValue: any) => {
    setEditingSettingId(settingId);
    setEditValue(JSON.stringify(currentValue));
    setChangeReason('');
  };

  const handleSaveClick = async (settingId: string, isProtected: boolean) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editValue);
      } catch (e) {
        // If it's not valid JSON, use the string value directly
        parsedValue = editValue;
      }

      await updateSetting(
        settingId, 
        parsedValue, 
        isProtected ? changeReason : undefined
      );
      
      setEditingSettingId(null);
      setEditValue('');
      setChangeReason('');
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingSettingId(null);
    setEditValue('');
    setChangeReason('');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Manage global system settings and configuration parameters
        </p>
      </div>

      <ConfigurationTabs 
        category={category}
        setCategory={setCategory}
        settings={settings}
        isLoading={isLoading}
        editingSettingId={editingSettingId}
        editValue={editValue}
        changeReason={changeReason}
        onEditClick={handleEditClick}
        onSaveClick={handleSaveClick}
        onCancelClick={handleCancelClick}
        setEditValue={setEditValue}
        setChangeReason={setChangeReason}
      />
    </div>
  );
};

export default SystemConfigurationPage;
