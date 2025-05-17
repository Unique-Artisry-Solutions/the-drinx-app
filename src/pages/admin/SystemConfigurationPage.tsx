
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import GeneralSettingsTab from '@/components/admin/systemConfiguration/tabs/GeneralSettingsTab';
import FeatureAnalyticsTab from '@/components/admin/systemConfiguration/tabs/FeatureAnalyticsTab';
import SecuritySettingsTab from '@/components/admin/systemConfiguration/tabs/SecuritySettingsTab';
import EmailSettingsTab from '@/components/admin/systemConfiguration/tabs/EmailSettingsTab';
import PaymentSettingsTab from '@/components/admin/systemConfiguration/tabs/PaymentSettingsTab';
import ApiSettingsTab from '@/components/admin/systemConfiguration/tabs/ApiSettingsTab';
import FeatureTierMappingTab from '@/components/admin/systemConfiguration/tabs/FeatureTierMappingTab';
import FeatureTogglesTab from '@/components/admin/systemConfiguration/tabs/FeatureTogglesTab';
import { Card } from '@/components/ui/card';
import { SystemSetting } from '@/components/admin/systemConfiguration/tabs/types';

const SystemConfigurationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from query params or default to 'general'
  const getTabFromQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'general';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromQueryParams());
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [changeReason, setChangeReason] = useState('');
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/system-configuration?tab=${value}`, { replace: true });
  };
  
  // Update tab state if URL changes
  useEffect(() => {
    setActiveTab(getTabFromQueryParams());
  }, [location.search]);

  // Mock fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock settings with correct SystemSetting type
        const mockSettings: SystemSetting[] = [
          {
            id: '1',
            key: 'site.name',
            value: 'Spiritless',
            description: 'The name of the site',
            category: 'general',
            is_protected: false,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            key: 'site.description',
            value: 'Alcohol-free experience platform',
            description: 'Site description',
            category: 'general',
            is_protected: false,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }
        ];
        
        setSettings(mockSettings);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleEditClick = (id: string) => {
    const setting = settings.find(s => s.id === id);
    if (setting) {
      setEditingSettingId(id);
      setEditValue(String(setting.value));
    }
  };

  const handleSaveClick = async (id: string) => {
    const setting = settings.find(s => s.id === id);
    if (setting) {
      await handleSave(id, setting.is_protected);
    }
  };

  const handleCancelClick = () => {
    setEditingSettingId(null);
  };

  const handleEdit = (id: string, value: any) => {
    setEditingSettingId(id);
    setEditValue(value);
  };

  const handleSave = async (id: string, isProtected: boolean) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(prev => 
        prev.map(setting => 
          setting.id === id ? { ...setting, value: editValue } : setting
        )
      );
      setEditingSettingId(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update setting'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingSettingId(null);
  };
  
  const handleEditValueChange = (value: any) => {
    setEditValue(value);
  };

  // Common props for all settings tabs
  const tabProps = {
    settings,
    isLoading,
    editingSettingId,
    editValue,
    changeReason,
    onEdit: handleEdit,
    onSave: handleSave,
    onCancel: handleCancel,
    onEditValueChange: handleEditValueChange,
    setChangeReason,
    isSubmitting,
    error,
    onEditClick: handleEditClick,
    onSaveClick: handleSaveClick,
    onCancelClick: handleCancelClick,
    setEditValue
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-2">System Configuration</h1>
      <p className="text-muted-foreground mb-6">Manage system settings, features, and configurations</p>
      
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="toggles">Toggles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettingsTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="features">
            <FeatureTierMappingTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="toggles">
            <FeatureTogglesTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <FeatureAnalyticsTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettingsTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailSettingsTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSettingsTab {...tabProps} />
          </TabsContent>
          
          <TabsContent value="api">
            <ApiSettingsTab {...tabProps} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemConfigurationPage;
