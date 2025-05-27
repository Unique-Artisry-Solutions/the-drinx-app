
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationIntegrityTester } from '@/components/notifications/testing/NotificationIntegrityTester';
import { NotificationErrorTester } from '@/components/notifications/testing/NotificationErrorTester';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Shield, MapPin, Settings, AlertTriangle } from 'lucide-react';

export default function NotificationTestingPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Notification System Testing</h1>
            <p className="text-muted-foreground">
              Comprehensive testing suite for notification delivery, error handling, and performance
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Phase 3: Error Handling & Performance
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Tests</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Role-based delivery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Push Tests</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">VAPID & permissions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location Tests</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Geofence filtering</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preference Tests</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Settings validation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Tests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Error handling & performance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="integrity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrity" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Integrity Testing
            </TabsTrigger>
            <TabsTrigger value="error-handling" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error Handling & Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrity" className="mt-6">
            <NotificationIntegrityTester />
          </TabsContent>

          <TabsContent value="error-handling" className="mt-6">
            <NotificationErrorTester />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
