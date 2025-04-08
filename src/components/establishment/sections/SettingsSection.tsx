
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsSectionProps {
  handleTabChange: (tab: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ handleTabChange }) => {
  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Account settings, preferences, and configuration options.</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-medium">Account Information</h3>
              <p className="text-sm text-gray-500">Update your establishment details</p>
            </div>
            <button className="text-blue-600" onClick={() => handleTabChange('profile')}>
              Edit
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-medium">Notification Preferences</h3>
              <p className="text-sm text-gray-500">Manage your notification settings</p>
            </div>
            <button className="text-blue-600">Edit</button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-medium">Privacy Settings</h3>
              <p className="text-sm text-gray-500">Control your privacy options</p>
            </div>
            <button className="text-blue-600">Edit</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
