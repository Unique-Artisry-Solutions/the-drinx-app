import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor,
  Clock,
  Moon,
  Volume2,
  VolumeX,
  Vibrate,
  MapPin
} from 'lucide-react';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { useAuth } from '@/hooks/useAuth';
import { NotificationCategory, NotificationFormData } from '@/types/notification';

interface NotificationPreferencesPanelProps {
  className?: string;
}

export const NotificationPreferencesPanel: React.FC<NotificationPreferencesPanelProps> = ({
  className = ""
}) => {
  const { user } = useAuth();
  const { preferences, isLoading, savePreferences, fetchPreferences } = useNotificationPreferences(user?.id);
  
  const [formData, setFormData] = useState<NotificationFormData>({
    email_notifications: true,
    push_notifications: true,
    global_quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    notification_categories: {
      general: {
        enabled: true,
        priority: 'medium',
        channels: { email: true, push: true },
        sound: true,
        vibration: true,
        timeWindow: { enabled: false, start: '09:00', end: '17:00' }
      },
      social: {
        enabled: true,
        priority: 'medium',
        channels: { email: false, push: true },
        sound: false,
        vibration: true,
        timeWindow: { enabled: false, start: '09:00', end: '17:00' }
      },
      security: {
        enabled: true,
        priority: 'high',
        channels: { email: true, push: true },
        sound: true,
        vibration: true,
        timeWindow: { enabled: false, start: '00:00', end: '23:59' }
      },
      updates: {
        enabled: true,
        priority: 'low',
        channels: { email: true, push: false },
        sound: false,
        vibration: false,
        timeWindow: { enabled: true, start: '09:00', end: '17:00' }
      }
    }
  });

  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    }
  }, [user?.id, fetchPreferences]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      // Save each category preference
      for (const [categoryId, category] of Object.entries(formData.notification_categories)) {
        const channels: ('email' | 'push' | 'in_app')[] = [];
        if (category.channels.email) channels.push('email');
        if (category.channels.push) channels.push('push');
        channels.push('in_app'); // Always include in-app

        await savePreferences(
          categoryId,
          channels,
          category.enabled,
          {
            priority: category.priority,
            sound: category.sound,
            vibration: category.vibration,
            timeWindowEnabled: category.timeWindow.enabled,
            quietHoursStart: formData.global_quiet_hours.start,
            quietHoursEnd: formData.global_quiet_hours.end,
            timeWindowStart: category.timeWindow.start,
            timeWindowEnd: category.timeWindow.end
          }
        );
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const updateCategory = (categoryId: string, updates: Partial<NotificationCategory>) => {
    setFormData(prev => ({
      ...prev,
      notification_categories: {
        ...prev.notification_categories,
        [categoryId]: {
          ...prev.notification_categories[categoryId],
          ...updates
        }
      }
    }));
  };

  const CategorySettings: React.FC<{ categoryId: string; category: NotificationCategory }> = ({ 
    categoryId, 
    category 
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base capitalize">
              {categoryId.replace('_', ' ')} Notifications
            </CardTitle>
            <CardDescription className="text-sm">
              Manage {categoryId} notification preferences
            </CardDescription>
          </div>
          <Switch
            checked={category.enabled}
            onCheckedChange={(enabled) => updateCategory(categoryId, { enabled })}
          />
        </div>
      </CardHeader>
      
      {category.enabled && (
        <CardContent className="space-y-4">
          {/* Priority */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`${categoryId}-priority`}>Priority Level</Label>
            <Select
              value={category.priority}
              onValueChange={(priority: 'low' | 'medium' | 'high' | 'urgent') => 
                updateCategory(categoryId, { priority })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <Label>Delivery Channels</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={category.channels.email}
                  onCheckedChange={(email) => 
                    updateCategory(categoryId, { 
                      channels: { ...category.channels, email } 
                    })
                  }
                />
                <Label>Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={category.channels.push}
                  onCheckedChange={(push) => 
                    updateCategory(categoryId, { 
                      channels: { ...category.channels, push } 
                    })
                  }
                />
                <Label>Push</Label>
              </div>
            </div>
          </div>

          {/* Audio/Visual */}
          <div className="space-y-3">
            <Label>Audio & Visual</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={category.sound}
                  onCheckedChange={(sound) => updateCategory(categoryId, { sound })}
                />
                <Label>Sound</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Vibrate className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={category.vibration}
                  onCheckedChange={(vibration) => updateCategory(categoryId, { vibration })}
                />
                <Label>Vibration</Label>
              </div>
            </div>
          </div>

          {/* Time Window */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={category.timeWindow.enabled}
                onCheckedChange={(enabled) => 
                  updateCategory(categoryId, { 
                    timeWindow: { ...category.timeWindow, enabled } 
                  })
                }
              />
              <Label>Time Window</Label>
            </div>
            
            {category.timeWindow.enabled && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <Label htmlFor={`${categoryId}-start`} className="text-xs">Start</Label>
                  <Input
                    id={`${categoryId}-start`}
                    type="time"
                    value={category.timeWindow.start}
                    onChange={(e) => 
                      updateCategory(categoryId, { 
                        timeWindow: { ...category.timeWindow, start: e.target.value } 
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`${categoryId}-end`} className="text-xs">End</Label>
                  <Input
                    id={`${categoryId}-end`}
                    type="time"
                    value={category.timeWindow.end}
                    onChange={(e) => 
                      updateCategory(categoryId, { 
                        timeWindow: { ...category.timeWindow, end: e.target.value } 
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Master controls for all notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch
                  checked={formData.email_notifications}
                  onCheckedChange={(email_notifications) => 
                    setFormData(prev => ({ ...prev, email_notifications }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label>Push Notifications</Label>
                </div>
                <Switch
                  checked={formData.push_notifications}
                  onCheckedChange={(push_notifications) => 
                    setFormData(prev => ({ ...prev, push_notifications }))
                  }
                />
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={formData.global_quiet_hours.enabled}
                    onCheckedChange={(enabled) => 
                      setFormData(prev => ({
                        ...prev,
                        global_quiet_hours: { ...prev.global_quiet_hours, enabled }
                      }))
                    }
                  />
                  <Label>Quiet Hours</Label>
                </div>
                
                {formData.global_quiet_hours.enabled && (
                  <div className="grid grid-cols-2 gap-3 ml-6">
                    <div>
                      <Label htmlFor="quiet-start" className="text-xs">Start</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={formData.global_quiet_hours.start}
                        onChange={(e) => 
                          setFormData(prev => ({
                            ...prev,
                            global_quiet_hours: { 
                              ...prev.global_quiet_hours, 
                              start: e.target.value 
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end" className="text-xs">End</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={formData.global_quiet_hours.end}
                        onChange={(e) => 
                          setFormData(prev => ({
                            ...prev,
                            global_quiet_hours: { 
                              ...prev.global_quiet_hours, 
                              end: e.target.value 
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Settings */}
        <TabsContent value="categories" className="space-y-4">
          {Object.entries(formData.notification_categories).map(([categoryId, category]) => (
            <CategorySettings key={categoryId} categoryId={categoryId} category={category} />
          ))}
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Fine-tune your notification experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Do Not Disturb Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily pause all non-urgent notifications
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Location-Based Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter notifications based on your location
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Smart Grouping</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically group similar notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};