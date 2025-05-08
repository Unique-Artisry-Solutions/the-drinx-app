
import React, { useState, useEffect } from 'react';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import ConfigurationTabs from '@/components/admin/systemConfiguration/ConfigurationTabs';
import { updateSystemSetting } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import { Metric, ArrowDown } from 'lucide-react';
import { SystemSetting } from '@/types/SupabaseTables';
import FeatureTogglesTab from '@/components/admin/systemConfiguration/tabs/FeatureTogglesTab';
import FeatureTierMappingTab from '@/components/admin/systemConfiguration/tabs/FeatureTierMappingTab';
import FeatureAnalyticsTab from '@/components/admin/systemConfiguration/tabs/FeatureAnalyticsTab';

const SystemConfigurationPage = () => {
  const { settings, isLoading, refetchSettings } = useSystemConfiguration();
  const [category, setCategory] = useState('general');
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [changeReason, setChangeReason] = useState('');
  const { toast } = useToast();
  
  const settingsForCategory = settings.filter(setting => {
    switch (category) {
      case 'general':
        return setting.category === 'general';
      case 'email':
        return setting.category === 'email';
      case 'security':
        return setting.category === 'security';
      case 'api':
        return setting.category === 'api';
      case 'payment':
        return setting.category === 'payment';
      default:
        return false;
    }
  });

  const handleEditClick = (settingId: string, currentValue: any) => {
    setEditingSettingId(settingId);
    setEditValue(typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue));
    setChangeReason('');
  };

  const handleCancelClick = () => {
    setEditingSettingId(null);
    setEditValue('');
    setChangeReason('');
  };

  const handleSaveClick = async (settingId: string, isProtected: boolean) => {
    try {
      // For protected settings, we require a reason
      if (isProtected && !changeReason) {
        toast({
          variant: 'destructive',
          title: 'Reason required',
          description: 'Please provide a reason for changing this protected setting.',
        });
        return;
      }

      // Parse JSON if the value looks like a JSON object
      let parsedValue = editValue;
      if (editValue.trim().startsWith('{') || editValue.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'Invalid JSON',
            description: 'The entered value is not valid JSON.',
          });
          return;
        }
      }

      await updateSystemSetting(settingId, parsedValue, changeReason);
      
      toast({
        title: 'Setting updated',
        description: 'The system setting has been updated successfully.',
      });
      
      // Reset editing state
      setEditingSettingId(null);
      setEditValue('');
      setChangeReason('');
      
      // Refetch settings
      refetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was an error updating the setting.',
      });
    }
  };

  // Create props object to pass to the tabs
  const settingsTabProps = {
    settings: settingsForCategory,
    isLoading,
    editingSettingId,
    editValue,
    changeReason,
    onEditClick: handleEditClick,
    onSaveClick: handleSaveClick,
    onCancelClick: handleCancelClick,
    setEditValue,
    setChangeReason,
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and configurations
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-10">
              <div className="flex justify-center items-center">
                <Spinner size="lg" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <ConfigurationTabs
            category={category}
            setCategory={setCategory}
            {...settingsTabProps}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SystemConfigurationPage;
