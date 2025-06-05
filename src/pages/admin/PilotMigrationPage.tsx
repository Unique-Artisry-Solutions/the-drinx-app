
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import PilotHealthDashboard from '@/components/admin/monitoring/PilotHealthDashboard';
import AuthTestPanel from '@/components/development/AuthTestPanel';
import SafeUserProfile from '@/components/common/SafeUserProfile';
import { TestTube, Monitor, User, Activity } from 'lucide-react';

const PilotMigrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Phase 3 Pilot Migration</h1>
          <p className="text-muted-foreground mt-2">
            Testing enhanced auth patterns and isolated service registry
          </p>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="auth-test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Auth Testing
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Health Monitoring
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Safe Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pilot Migration Status</CardTitle>
                <CardDescription>
                  Phase 1 implementation with minimal risk components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">✅ Components Migrated</h3>
                      <ul className="text-sm space-y-1">
                        <li>• AuthTestPanel → useCompatibleAuth() + useEnhancedAuth()</li>
                        <li>• SafeUserProfile → useCompatibleAuth() + safeTypeConverters</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">🔧 Services Registered</h3>
                      <ul className="text-sm space-y-1">
                        <li>• NotificationService → isolatedServiceRegistry</li>
                        <li>• SimplifiedAdminService → isolatedServiceRegistry</li>
                        <li>• ServiceConfig → isolatedServiceRegistry</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">✅ Zero Breaking Changes</h4>
                  <p className="text-sm text-green-700">
                    All existing functionality remains intact. The pilot uses additive patterns 
                    that enhance rather than replace existing code.
                  </p>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">📊 Enhanced Monitoring</h4>
                  <p className="text-sm text-blue-700">
                    Services now provide health checks, metrics, and performance monitoring 
                    through the isolated registry system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth-test">
            <div className="flex justify-center">
              <AuthTestPanel />
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <PilotHealthDashboard />
          </TabsContent>

          <TabsContent value="profile">
            <div className="flex justify-center">
              <SafeUserProfile />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PilotMigrationPage;
