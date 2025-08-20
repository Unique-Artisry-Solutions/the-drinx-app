import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Settings, TestTube } from 'lucide-react';
import { 
  InAppToastProvider,
  AudioVisualProvider,
  NotificationCenter,
  AudioVisualSettings,
  UnreadCounter,
  PriorityIndicator
} from '@/components/notifications/enhanced';
import { useNotifications } from '@/hooks/useNotifications';

export default function EnhancedNotificationsPage() {
  const { unreadCount } = useNotifications();

  return (
    <AudioVisualProvider>
      <InAppToastProvider>
        <Layout>
          <div className="container mx-auto py-8 max-w-6xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UnreadCounter count={unreadCount}>
                    <Bell className="h-8 w-8 text-primary" />
                  </UnreadCounter>
                  <div>
                    <h1 className="text-3xl font-bold">Enhanced Notifications</h1>
                    <p className="text-muted-foreground">
                      Advanced notification management with real-time updates
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <PriorityIndicator priority="urgent" showLabel />
                  <PriorityIndicator priority="high" showLabel />
                  <PriorityIndicator priority="medium" showLabel />
                </div>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="notifications" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="demo" className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Demo & Testing
                  </TabsTrigger>
                </TabsList>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <NotificationCenter
                    maxHeight="70vh"
                    showSearch={true}
                    showFilters={true}
                    showGrouping={true}
                  />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <AudioVisualSettings />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Configure your notification preferences including delivery methods, 
                            quiet hours, and category-specific settings.
                          </p>
                          <div className="text-center py-8 text-muted-foreground">
                            <Settings className="mx-auto h-12 w-12 mb-2 opacity-50" />
                            <p>Notification preferences coming soon...</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Demo Tab */}
                <TabsContent value="demo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification System Demo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Test and demonstrate the enhanced notification system features
                          including real-time updates, toast notifications, and audio-visual feedback.
                        </p>
                        <div className="text-center py-8 text-muted-foreground">
                          <TestTube className="mx-auto h-12 w-12 mb-2 opacity-50" />
                          <p>Interactive demo components coming soon...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Layout>
      </InAppToastProvider>
    </AudioVisualProvider>
  );
}