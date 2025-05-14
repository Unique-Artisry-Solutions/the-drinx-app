
import React, { useState, useEffect, useCallback } from 'react';
import { useSystemConfiguration } from '@/hooks/admin/useSystemConfiguration';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ConfigurationTabs from '@/components/admin/systemConfiguration/ConfigurationTabs';
import { updateSystemSetting } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import PageSuspense from '@/components/loading/PageSuspense';
import ComponentSuspense from '@/components/loading/ComponentSuspense';

const SystemConfigurationPage = () => {
  const { 
    settings, 
    isLoading, 
    error, 
    fetchSettings, 
    hasAttemptedFetch 
  } = useSystemConfiguration({ initialFetch: true });
  
  const [category, setCategory] = useState('general');
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [changeReason, setChangeReason] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  const settingsForCategory = settings.filter(setting => setting.category === category);
  const hasSettings = settings.length > 0;

  const handleRefresh = useCallback(() => {
    fetchSettings();
    setRetryCount(prev => prev + 1);
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest configuration settings...',
    });
  }, [fetchSettings, toast]);

  const handleEditClick = useCallback((settingId: string, currentValue: any) => {
    setEditingSettingId(settingId);
    setEditValue(typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2));
    setChangeReason('');
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditingSettingId(null);
    setEditValue('');
    setChangeReason('');
  }, []);

  const handleSaveClick = useCallback(async (settingId: string, isProtected: boolean) => {
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
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'There was an error updating the setting.',
      });
    }
  }, [editValue, changeReason, toast, fetchSettings]);

  // Create settings tab props object
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

  const renderErrorState = () => (
    <Card>
      <CardContent className="py-10">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error loading settings</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Retry {retryCount > 0 ? `(${retryCount})` : ''}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLoadingState = () => (
    <Card>
      <CardContent className="py-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading system configuration...</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and configurations
          </p>
        </div>
        {hasSettings && (
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        )}
      </div>

      <PageSuspense>
        <Tabs value={category} className="w-full" onValueChange={setCategory}>
          <ComponentSuspense>
            <ConfigurationTabs
              category={category}
              setCategory={setCategory}
              {...settingsTabProps}
            />
          </ComponentSuspense>

          {error && renderErrorState()}
          {isLoading && !hasSettings && renderLoadingState()}
        </Tabs>
      </PageSuspense>
    </div>
  );
};

export default SystemConfigurationPage;
