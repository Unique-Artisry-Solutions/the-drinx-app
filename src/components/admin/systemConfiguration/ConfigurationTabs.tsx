
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Server, Bell, Shield, CreditCard, ToggleLeft } from 'lucide-react';
import SystemSettingsTable from './SystemSettingsTable';
import { SystemSetting } from '@/types/SupabaseTables';

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
      <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings size={16} />
          <span className="hidden sm:inline">General</span>
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Bell size={16} />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield size={16} />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="api" className="flex items-center gap-2">
          <Server size={16} />
          <span className="hidden sm:inline">API</span>
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex items-center gap-2">
          <CreditCard size={16} />
          <span className="hidden sm:inline">Payment</span>
        </TabsTrigger>
        <TabsTrigger value="features" className="flex items-center gap-2">
          <ToggleLeft size={16} />
          <span className="hidden sm:inline">Features</span>
        </TabsTrigger>
      </TabsList>

      {/* Content for all tabs */}
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage system-wide configuration settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="email" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email & Notification Settings</CardTitle>
            <CardDescription>Configure email templates and notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="api" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Manage API keys and integration settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Settings</CardTitle>
            <CardDescription>Configure payment processing settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="features" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Feature Toggles</CardTitle>
            <CardDescription>Enable or disable specific features</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsTable
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ConfigurationTabs;
