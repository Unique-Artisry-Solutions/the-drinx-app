
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Clock, Filter, Search, Mail, Smartphone, Globe } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesManagerProps {
  promoterId: string;
}

interface FollowerPreferences {
  id: string;
  follower_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    events: boolean;
    promotions: boolean;
    updates: boolean;
    social: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  last_updated: string;
}

const NotificationPreferencesManager: React.FC<NotificationPreferencesManagerProps> = ({ promoterId }) => {
  const { followers } = useSubscriptions(promoterId);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);

  // Mock preferences data
  const [followerPreferences, setFollowerPreferences] = useState<FollowerPreferences[]>(
    followers?.map(follower => ({
      id: `pref-${follower.id}`,
      follower_id: follower.id,
      email_notifications: true,
      push_notifications: follower.notification_preferences?.events !== false,
      sms_notifications: false,
      quiet_hours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      categories: {
        events: true,
        promotions: true,
        updates: follower.notification_preferences?.events !== false,
        social: false
      },
      frequency: 'immediate' as const,
      last_updated: new Date().toISOString()
    })) || []
  );

  const getFollowerInfo = (followerId: string) => {
    return followers?.find(f => f.id === followerId);
  };

  const updateFollowerPreferences = (followerId: string, updates: Partial<FollowerPreferences>) => {
    setFollowerPreferences(prev => prev.map(pref => 
      pref.follower_id === followerId 
        ? { ...pref, ...updates, last_updated: new Date().toISOString() }
        : pref
    ));
    
    toast({
      title: "Preferences Updated",
      description: "Notification preferences have been saved.",
    });
  };

  const updateBulkPreferences = (updates: Partial<FollowerPreferences>) => {
    setFollowerPreferences(prev => prev.map(pref => 
      selectedFollowers.includes(pref.follower_id)
        ? { ...pref, ...updates, last_updated: new Date().toISOString() }
        : pref
    ));
    
    toast({
      title: "Bulk Update Complete",
      description: `Updated preferences for ${selectedFollowers.length} followers.`,
    });
    setSelectedFollowers([]);
  };

  const filteredPreferences = followerPreferences.filter(pref => {
    const follower = getFollowerInfo(pref.follower_id);
    const matchesSearch = !searchQuery || 
      follower?.subscriber_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'email_enabled' && pref.email_notifications) ||
      (filterType === 'push_enabled' && pref.push_notifications) ||
      (filterType === 'quiet_hours' && pref.quiet_hours.enabled);
    
    return matchesSearch && matchesFilter;
  });

  const getPreferencesSummary = () => {
    const total = followerPreferences.length;
    const emailEnabled = followerPreferences.filter(p => p.email_notifications).length;
    const pushEnabled = followerPreferences.filter(p => p.push_notifications).length;
    const quietHoursEnabled = followerPreferences.filter(p => p.quiet_hours.enabled).length;
    
    return { total, emailEnabled, pushEnabled, quietHoursEnabled };
  };

  const summary = getPreferencesSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Preferences Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search followers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Followers</SelectItem>
                  <SelectItem value="email_enabled">Email Enabled</SelectItem>
                  <SelectItem value="push_enabled">Push Enabled</SelectItem>
                  <SelectItem value="quiet_hours">Quiet Hours Set</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredPreferences.map(pref => {
                const follower = getFollowerInfo(pref.follower_id);
                if (!follower) return null;

                return (
                  <Card key={pref.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">
                            Follower {follower.subscriber_id.slice(0, 8)}...
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Joined: {new Date(follower.subscription_start).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                          {follower.follow_status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Channels</h5>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Email</span>
                            </div>
                            <Switch
                              checked={pref.email_notifications}
                              onCheckedChange={(checked) => 
                                updateFollowerPreferences(pref.follower_id, { email_notifications: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Push</span>
                            </div>
                            <Switch
                              checked={pref.push_notifications}
                              onCheckedChange={(checked) => 
                                updateFollowerPreferences(pref.follower_id, { push_notifications: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Quiet Hours</span>
                            </div>
                            <Switch
                              checked={pref.quiet_hours.enabled}
                              onCheckedChange={(checked) => 
                                updateFollowerPreferences(pref.follower_id, { 
                                  quiet_hours: { ...pref.quiet_hours, enabled: checked }
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Categories</h5>
                          
                          {Object.entries(pref.categories).map(([category, enabled]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{category}</span>
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => 
                                  updateFollowerPreferences(pref.follower_id, {
                                    categories: { ...pref.categories, [category]: checked }
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {pref.quiet_hours.enabled && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Start Time</label>
                              <Input
                                type="time"
                                value={pref.quiet_hours.start}
                                onChange={(e) => 
                                  updateFollowerPreferences(pref.follower_id, {
                                    quiet_hours: { ...pref.quiet_hours, start: e.target.value }
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">End Time</label>
                              <Input
                                type="time"
                                value={pref.quiet_hours.end}
                                onChange={(e) => 
                                  updateFollowerPreferences(pref.follower_id, {
                                    quiet_hours: { ...pref.quiet_hours, end: e.target.value }
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bulk Preference Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Followers</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {followerPreferences.map(pref => {
                      const follower = getFollowerInfo(pref.follower_id);
                      if (!follower) return null;

                      return (
                        <div key={pref.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={pref.follower_id}
                            checked={selectedFollowers.includes(pref.follower_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFollowers(prev => [...prev, pref.follower_id]);
                              } else {
                                setSelectedFollowers(prev => prev.filter(id => id !== pref.follower_id));
                              }
                            }}
                          />
                          <label htmlFor={pref.follower_id} className="text-sm">
                            Follower {follower.subscriber_id.slice(0, 8)}...
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedFollowers.length} of {followerPreferences.length} followers selected
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => updateBulkPreferences({ email_notifications: true })}
                    disabled={selectedFollowers.length === 0}
                  >
                    Enable Email for Selected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateBulkPreferences({ email_notifications: false })}
                    disabled={selectedFollowers.length === 0}
                  >
                    Disable Email for Selected
                  </Button>
                  <Button
                    onClick={() => updateBulkPreferences({ push_notifications: true })}
                    disabled={selectedFollowers.length === 0}
                  >
                    Enable Push for Selected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateBulkPreferences({ push_notifications: false })}
                    disabled={selectedFollowers.length === 0}
                  >
                    Disable Push for Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Total Followers</span>
                  </div>
                  <div className="text-2xl font-bold">{summary.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Email Enabled</span>
                  </div>
                  <div className="text-2xl font-bold">{summary.emailEnabled}</div>
                  <div className="text-xs text-muted-foreground">
                    {((summary.emailEnabled / summary.total) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Push Enabled</span>
                  </div>
                  <div className="text-2xl font-bold">{summary.pushEnabled}</div>
                  <div className="text-xs text-muted-foreground">
                    {((summary.pushEnabled / summary.total) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Quiet Hours Set</span>
                  </div>
                  <div className="text-2xl font-bold">{summary.quietHoursEnabled}</div>
                  <div className="text-xs text-muted-foreground">
                    {((summary.quietHoursEnabled / summary.total) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preference Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Email Notifications</span>
                      <span>{summary.emailEnabled}/{summary.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(summary.emailEnabled / summary.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Push Notifications</span>
                      <span>{summary.pushEnabled}/{summary.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(summary.pushEnabled / summary.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quiet Hours Enabled</span>
                      <span>{summary.quietHoursEnabled}/{summary.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(summary.quietHoursEnabled / summary.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesManager;
