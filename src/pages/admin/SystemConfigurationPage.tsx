
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
        setSettings([
          {
            id: '1',
            key: 'site.name',
            value: 'Spiritless',
            description: 'The name of the site',
            type: 'string',
            is_protected: false,
            category: 'general',
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            key: 'site.description',
            value: 'Alcohol-free experience platform',
            description: 'Site description',
            type: 'string',
            is_protected: false,
            category: 'general',
            updated_at: new Date().toISOString(),
          }
        ] as SystemSetting[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleEdit = (setting: SystemSetting) => {
    setEditingSettingId(setting.id);
    setEditValue(setting.value);
  };

  const handleSave = async (id: string, value: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(prev => 
        prev.map(setting => 
          setting.id === id ? { ...setting, value } : setting
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
  
  const handleEditValueChange = (value: string) => {
    setEditValue(value);
  };

  // Common props for all settings tabs
  const tabProps = {
    settings,
    isLoading,
    editingSettingId,
    editValue,
    onEdit: handleEdit,
    onSave: handleSave,
    onCancel: handleCancel,
    onEditValueChange: handleEditValueChange,
    isSubmitting,
    error,
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
