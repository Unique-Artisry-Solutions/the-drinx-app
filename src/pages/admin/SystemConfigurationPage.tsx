
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Settings, Shield, Clock } from 'lucide-react';
import SystemSettingsTable from '@/components/admin/systemSettings/SystemSettingsTable';
import AuditLogTable from '@/components/admin/systemSettings/AuditLogTable';

const SystemConfigurationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const { 
    settings, 
    loading, 
    error, 
    updateSetting,
    fetchSettings
  } = useSystemSettings();

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  const categories = [...new Set(settings.map(s => s.category))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader onLogout={handleLogout} />
        <main className="container max-w-7xl mx-auto p-4 pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading system configuration...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader onLogout={handleLogout} />
        <main className="container max-w-7xl mx-auto p-4 pt-8">
          <Alert variant="destructive" className="my-8">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
            <p className="text-gray-500">Manage system-wide settings and configurations</p>
          </div>
        </div>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Protected Settings</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Audit Log</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure application-wide settings and feature flags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map(category => (
                    <TabsContent key={category} value={category}>
                      <SystemSettingsTable 
                        settings={settings.filter(s => s.category === category && !s.is_protected)} 
                        onUpdateSetting={updateSetting}
                        categoryLabel={category.charAt(0).toUpperCase() + category.slice(1)}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Protected Settings</CardTitle>
                <CardDescription>
                  These settings require approval and documentation when changed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemSettingsTable 
                  settings={settings.filter(s => s.is_protected)} 
                  onUpdateSetting={updateSetting}
                  categoryLabel="Protected"
                  showCategory
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Settings Audit Log</CardTitle>
                <CardDescription>
                  View history of changes to protected settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditLogTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemConfigurationPage;
