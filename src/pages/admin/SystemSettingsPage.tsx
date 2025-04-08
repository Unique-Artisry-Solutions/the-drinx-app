
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemSettingsPanel from '@/components/admin/systemSettings/SystemSettingsPanel';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, BarChart2 } from 'lucide-react';

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('settings');
  
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Settings</h1>
            <p className="text-gray-500">Configure application-wide settings and view audit logs</p>
          </div>
        </div>
        
        <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <SystemSettingsPanel showTitle={false} />
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
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Audit log will be implemented in the next phase</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemSettingsPage;
