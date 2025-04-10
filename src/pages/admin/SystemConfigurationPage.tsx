
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Server, Bell, Shield, CreditCard, ToggleLeft } from 'lucide-react';

const SystemConfigurationPage: React.FC = () => {
  const [category, setCategory] = useState<string>('general');
  const { 
    settings, 
    isLoading, 
    updateSetting, 
    fetchSettings
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

  const renderSettingValue = (value: any) => {
    if (value === null || value === undefined) return 'null';
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  const renderTabs = () => {
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
              {renderSettingsTable()}
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
              {renderSettingsTable()}
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
              {renderSettingsTable()}
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
              {renderSettingsTable()}
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
              {renderSettingsTable()}
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
              {renderSettingsTable()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  const renderSettingsTable = () => {
    if (isLoading) {
      return <div className="flex justify-center py-6"><div className="loader">Loading...</div></div>;
    }

    if (!settings || settings.length === 0) {
      return <div className="text-center py-6 text-muted-foreground">No settings found for this category.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Value</th>
              <th className="text-left p-2 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} className="border-b hover:bg-muted/50">
                <td className="p-2 font-medium">{setting.key}</td>
                <td className="p-2 text-muted-foreground">{setting.description || '-'}</td>
                <td className="p-2">
                  {editingSettingId === setting.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full"
                      />
                      {setting.is_protected && (
                        <div>
                          <Label htmlFor="changeReason">Reason for change (required):</Label>
                          <Input
                            id="changeReason"
                            value={changeReason}
                            onChange={(e) => setChangeReason(e.target.value)}
                            placeholder="Provide a reason for this change"
                            className="w-full mt-1"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-all bg-muted p-2 rounded text-sm max-h-24 overflow-auto">
                      {renderSettingValue(setting.value)}
                    </pre>
                  )}
                </td>
                <td className="p-2">
                  {editingSettingId === setting.id ? (
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleSaveClick(setting.id, setting.is_protected)}
                        disabled={setting.is_protected && !changeReason}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleEditClick(setting.id, setting.value)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Manage global system settings and configuration parameters
        </p>
      </div>

      {renderTabs()}
    </div>
  );
};

export default SystemConfigurationPage;
