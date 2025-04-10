
import React, { useState } from 'react';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import ConfigurationTabs from '@/components/admin/systemConfiguration/ConfigurationTabs';
import AdminHeader from '@/components/admin/AdminHeader';

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

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_session_created');
    localStorage.removeItem('admin_bypass');
    localStorage.removeItem('bypass_user_id');
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_username');
    
    // Force a complete page reload and navigation to landing page
    window.location.href = '/landing';
  };

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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-6xl mx-auto p-4 pt-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">System Configuration</h1>
          <p className="text-gray-600 mb-4">
            Manage global system settings and configuration parameters
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
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
      </main>
    </div>
  );
};

export default SystemConfigurationPage;
