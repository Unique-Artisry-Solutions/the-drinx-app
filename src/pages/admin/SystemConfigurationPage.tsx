
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { AdminNavigation } from '@/components/navigation/AdminNavigation';
import { supabase } from '@/lib/supabase';
import { useFeatureToggles } from '@/hooks/admin/systemConfig/useFeatureToggles';

// Import tabs
import FeatureTogglesTab from '@/components/admin/systemConfiguration/tabs/FeatureTogglesTab';
import FeatureTierMappingTab from '@/components/admin/systemConfiguration/tabs/FeatureTierMappingTab';
import FeatureAnalyticsTab from '@/components/admin/systemConfiguration/tabs/FeatureAnalyticsTab';

const SystemConfigurationPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';
  
  const [systemSettings, setSystemSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [changeReason, setChangeReason] = useState('');

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Fetch system settings from the database
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;
      setSystemSettings(data || []);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEditClick = (settingId: string, currentValue: any) => {
    setEditingSettingId(settingId);
    setEditValue(JSON.stringify(currentValue, null, 2));
    setChangeReason('');
  };

  const handleSaveClick = async (settingId: string, isProtected: boolean) => {
    // For protected settings, require a change reason
    if (isProtected && !changeReason) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for this change',
        variant: 'destructive',
      });
      return;
    }

    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editValue);
      } catch (e) {
        toast({
          title: 'Invalid JSON',
          description: 'The value must be valid JSON',
          variant: 'destructive',
        });
        return;
      }

      // Update the setting
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          value: parsedValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingId)
        .select();

      if (error) throw error;

      // Log the change if it's a protected setting
      if (isProtected) {
        const setting = systemSettings.find(s => s.id === settingId);
        const { error: logError } = await supabase
          .from('system_settings_audit_log')
          .insert({
            setting_key: setting?.key,
            old_value: setting?.value,
            new_value: parsedValue,
            change_reason: changeReason,
          });

        if (logError) throw logError;
      }

      toast({
        title: 'Setting Updated',
        description: 'System setting has been updated successfully',
      });

      setEditingSettingId(null);
      setEditValue(null);
      setChangeReason('');
      fetchSettings();
    } catch (error) {
      console.error('Error updating system setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update system setting',
        variant: 'destructive',
      });
    }
  };

  const handleCancelClick = () => {
    setEditingSettingId(null);
    setEditValue(null);
    setChangeReason('');
  };

  return (
    <Layout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r bg-background p-4">
          <div className="text-lg font-bold mb-4">Admin Panel</div>
          <AdminNavigation />
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">System Configuration</h1>
            <p className="text-muted-foreground">
              Manage system settings, feature flags, and subscription tiers
            </p>
          </div>

          <Tabs value={initialTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="border-b">
              <TabsList className="flex h-auto flex-wrap justify-start gap-2 p-0">
                <TabsTrigger value="general" className="rounded py-2 px-3">
                  General
                </TabsTrigger>
                <TabsTrigger value="features" className="rounded py-2 px-3">
                  Feature Flags
                </TabsTrigger>
                <TabsTrigger value="tier-mapping" className="rounded py-2 px-3">
                  Tier Mapping
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded py-2 px-3">
                  Feature Analytics
                </TabsTrigger>
                <TabsTrigger value="advanced" className="rounded py-2 px-3">
                  Advanced
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage general system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* General settings would go here */}
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
                        {isLoading ? (
                          <tr>
                            <td colSpan={4} className="text-center py-6">
                              Loading settings...
                            </td>
                          </tr>
                        ) : (
                          systemSettings
                            .filter(setting => setting.category === 'general')
                            .map(setting => (
                              <tr key={setting.id} className="border-b">
                                <td className="p-2 font-medium">{setting.key}</td>
                                <td className="p-2 text-muted-foreground">{setting.description || '-'}</td>
                                <td className="p-2">
                                  {editingSettingId === setting.id ? (
                                    <div>
                                      <textarea
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        className="w-full h-32 p-2 border rounded"
                                      />
                                      {setting.is_protected && (
                                        <div className="mt-2">
                                          <label className="block text-sm">Reason for change:</label>
                                          <input
                                            type="text"
                                            value={changeReason}
                                            onChange={e => setChangeReason(e.target.value)}
                                            placeholder="Provide a reason for this change"
                                            className="w-full p-2 mt-1 border rounded"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <pre className="whitespace-pre-wrap break-all bg-muted p-2 rounded text-sm max-h-24 overflow-auto">
                                      {JSON.stringify(setting.value, null, 2)}
                                    </pre>
                                  )}
                                </td>
                                <td className="p-2">
                                  {editingSettingId === setting.id ? (
                                    <div className="flex flex-col space-y-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveClick(setting.id, setting.is_protected)}
                                        disabled={setting.is_protected && !changeReason}
                                      >
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelClick}>
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditClick(setting.id, setting.value)}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                        )}
                        {!isLoading && systemSettings.filter(setting => setting.category === 'general').length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-6 text-muted-foreground">
                              No general settings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <FeatureTogglesTab
                settings={systemSettings}
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
            </TabsContent>

            <TabsContent value="tier-mapping">
              <FeatureTierMappingTab />
            </TabsContent>

            <TabsContent value="analytics">
              <FeatureAnalyticsTab />
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced system settings. Use caution when modifying these settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Advanced settings would go here */}
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
                        {isLoading ? (
                          <tr>
                            <td colSpan={4} className="text-center py-6">
                              Loading settings...
                            </td>
                          </tr>
                        ) : (
                          systemSettings
                            .filter(setting => setting.category === 'advanced')
                            .map(setting => (
                              <tr key={setting.id} className="border-b">
                                <td className="p-2 font-medium">{setting.key}</td>
                                <td className="p-2 text-muted-foreground">{setting.description || '-'}</td>
                                <td className="p-2">
                                  {editingSettingId === setting.id ? (
                                    <div>
                                      <textarea
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        className="w-full h-32 p-2 border rounded"
                                      />
                                      {setting.is_protected && (
                                        <div className="mt-2">
                                          <label className="block text-sm">Reason for change:</label>
                                          <input
                                            type="text"
                                            value={changeReason}
                                            onChange={e => setChangeReason(e.target.value)}
                                            placeholder="Provide a reason for this change"
                                            className="w-full p-2 mt-1 border rounded"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <pre className="whitespace-pre-wrap break-all bg-muted p-2 rounded text-sm max-h-24 overflow-auto">
                                      {JSON.stringify(setting.value, null, 2)}
                                    </pre>
                                  )}
                                </td>
                                <td className="p-2">
                                  {editingSettingId === setting.id ? (
                                    <div className="flex flex-col space-y-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveClick(setting.id, setting.is_protected)}
                                        disabled={setting.is_protected && !changeReason}
                                      >
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelClick}>
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditClick(setting.id, setting.value)}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))
                        )}
                        {!isLoading && systemSettings.filter(setting => setting.category === 'advanced').length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-6 text-muted-foreground">
                              No advanced settings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default SystemConfigurationPage;
