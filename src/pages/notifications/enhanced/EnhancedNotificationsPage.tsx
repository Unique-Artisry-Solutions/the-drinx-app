import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, TestTube, Keyboard } from 'lucide-react';
import { 
  InAppToastProvider,
  AudioVisualProvider,
  NotificationCenter,
  AudioVisualSettings,
  UnreadCounter,
  PriorityIndicator,
  BulkSelectionProvider,
  NotificationPreferencesPanel,
  KeyboardShortcutHelp
} from '@/components/notifications/enhanced';
import { useNotifications } from '@/hooks/useNotifications';
import { useKeyboardShortcuts, createNotificationShortcuts } from '@/hooks/notifications/useKeyboardShortcuts';

export default function EnhancedNotificationsPage() {
  const { unreadCount } = useNotifications();
  const [currentTab, setCurrentTab] = useState('notifications');

  // Keyboard shortcuts for enhanced functionality
  const shortcuts = createNotificationShortcuts({
    onOpenNotificationCenter: () => setCurrentTab('notifications'),
    onToggleFilters: () => console.log('Toggle filters'), // Will be implemented by NotificationCenter
  });

  useKeyboardShortcuts({ shortcuts });

  return (
    <AudioVisualProvider>
      <InAppToastProvider enableRealTimeToasts maxConcurrentToasts={3}>
        <BulkSelectionProvider>
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
                    <KeyboardShortcutHelp shortcuts={shortcuts} />
                  </div>
                </div>

                {/* Main Content */}
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
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
                          <CardDescription>
                            Granular control over notification delivery and behavior
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <NotificationPreferencesPanel />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Demo Tab */}
                  <TabsContent value="demo" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Demo & Testing</CardTitle>
                        <CardDescription>
                          Test notification features and system capabilities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Real-time Notifications</Badge>
                            <Badge variant="secondary">Toast System</Badge>
                            <Badge variant="secondary">Audio/Visual Effects</Badge>
                            <Badge variant="secondary">Priority Handling</Badge>
                            <Badge variant="secondary">Bulk Operations</Badge>
                            <Badge variant="secondary">Quick Actions</Badge>
                            <Badge variant="secondary">Keyboard Shortcuts</Badge>
                            <Badge variant="secondary">Mobile Responsive</Badge>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Phase 2 Features</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>✅ Enhanced Toast System</li>
                                <li>✅ Notification Center/Inbox</li>
                                <li>✅ Advanced Badge System</li>
                                <li>✅ Audio/Visual Indicators</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Phase 3 Features</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>✅ Enhanced Bulk Operations</li>
                                <li>✅ Quick Actions System</li>
                                <li>✅ Keyboard Navigation</li>
                                <li>✅ Actionable Notifications</li>
                                <li>✅ Advanced Preferences</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Layout>
        </BulkSelectionProvider>
      </InAppToastProvider>
    </AudioVisualProvider>
  );
}