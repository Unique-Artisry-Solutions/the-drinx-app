import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, Users, Building2, AlertTriangle } from 'lucide-react';
import NotificationTester from '@/components/notifications/NotificationTester';
import DirectNotificationTester from '@/components/notifications/DirectNotificationTester';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RoleBasedNotificationTester } from '@/components/notifications/RoleBasedNotificationTester';

const NotificationTestingPage = () => {
  const [activeTab, setActiveTab] = useState('direct');

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Notification Testing System
            </CardTitle>
            <p className="text-muted-foreground">
              Test notification delivery between different roles in the system
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="direct" className="flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Direct</span>
                </TabsTrigger>
                <TabsTrigger value="user-promoter" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">User ↔ Promoter</span>
                </TabsTrigger>
                <TabsTrigger value="user-establishment" className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">User ↔ Establishment</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="direct" className="mt-0">
                <DirectNotificationTester />
              </TabsContent>
              
              <TabsContent value="user-promoter" className="mt-0">
                <RoleBasedNotificationTester />
              </TabsContent>
              
              <TabsContent value="user-establishment" className="mt-0">
                <RoleBasedNotificationTester />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                <Alert>
                  <AlertDescription>
                    Advanced notification testing features will be implemented in the next phase.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationTestingPage;
