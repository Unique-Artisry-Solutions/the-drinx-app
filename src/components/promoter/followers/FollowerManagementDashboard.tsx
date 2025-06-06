
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  Bell,
  UserMinus,
  UserCheck,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FollowerManagementDashboardProps {
  promoterId: string;
}

const FollowerManagementDashboard: React.FC<FollowerManagementDashboardProps> = ({ promoterId }) => {
  const { followers, isLoading, sendNotification, updatePreferences } = useSubscriptions(promoterId);
  const { exportAnalytics, isExporting } = useAnalyticsExport();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Filter followers based on search and filters
  const filteredFollowers = followers?.filter(follower => {
    const matchesSearch = !searchTerm || 
      follower.subscriber_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || follower.follow_status === statusFilter;
    
    const matchesTier = tierFilter === 'all' || 
      (tierFilter === 'premium' && follower.tier_id) ||
      (tierFilter === 'free' && !follower.tier_id);

    return matchesSearch && matchesStatus && matchesTier;
  }) || [];

  // Real-time metrics calculations
  const metrics = {
    total: followers?.length || 0,
    active: followers?.filter(f => f.follow_status === 'active').length || 0,
    premium: followers?.filter(f => f.tier_id).length || 0,
    growth: {
      thisWeek: followers?.filter(f => {
        const followDate = new Date(f.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return followDate > weekAgo;
      }).length || 0,
      thisMonth: followers?.filter(f => {
        const followDate = new Date(f.created_at);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return followDate > monthAgo;
      }).length || 0
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFollowers(filteredFollowers.map(f => f.id));
    } else {
      setSelectedFollowers([]);
    }
  };

  const handleSelectFollower = (followerId: string, checked: boolean) => {
    if (checked) {
      setSelectedFollowers(prev => [...prev, followerId]);
    } else {
      setSelectedFollowers(prev => prev.filter(id => id !== followerId));
    }
  };

  const handleBulkNotification = async () => {
    if (selectedFollowers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select followers to send notifications.",
        variant: "destructive"
      });
      return;
    }

    setBulkActionLoading(true);
    try {
      await sendNotification.mutateAsync({
        followerIds: selectedFollowers,
        title: "Update from Your Promoter",
        message: "You have a new update from your followed promoter!"
      });
      
      toast({
        title: "Notifications Sent",
        description: `Sent notifications to ${selectedFollowers.length} followers.`
      });
      setSelectedFollowers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk notifications.",
        variant: "destructive"
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkPreferencesUpdate = async (preferences: any) => {
    if (selectedFollowers.length === 0) return;

    setBulkActionLoading(true);
    try {
      for (const followerId of selectedFollowers) {
        await updatePreferences.mutateAsync({
          followerId,
          preferences
        });
      }
      
      toast({
        title: "Preferences Updated",
        description: `Updated preferences for ${selectedFollowers.length} followers.`
      });
      setSelectedFollowers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive"
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async () => {
    const exportData = filteredFollowers.map(follower => ({
      id: follower.id,
      subscriber_id: follower.subscriber_id,
      status: follower.follow_status,
      tier: follower.tier_id ? 'Premium' : 'Free',
      created_at: follower.created_at,
      last_interaction: follower.last_interaction_at || 'Never',
      notifications_enabled: follower.notification_preferences?.events !== false
    }));

    await exportAnalytics(exportData, 'followers_export');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Followers</p>
                <p className="text-2xl font-bold">{metrics.active}</p>
                <p className="text-xs text-green-600">
                  {Math.round((metrics.active / metrics.total) * 100) || 0}% active
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Premium Followers</p>
                <p className="text-2xl font-bold">{metrics.premium}</p>
                <p className="text-xs text-purple-600">
                  {Math.round((metrics.premium / metrics.total) * 100) || 0}% premium
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Growth</p>
                <p className="text-2xl font-bold">+{metrics.growth.thisWeek}</p>
                <p className="text-xs text-orange-600">This week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search followers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedFollowers.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedFollowers.length} followers selected
              </span>
              <Button 
                size="sm" 
                onClick={handleBulkNotification}
                disabled={bulkActionLoading}
              >
                <Bell className="h-4 w-4 mr-1" />
                Send Notification
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" disabled={bulkActionLoading}>
                    <MoreHorizontal className="h-4 w-4 mr-1" />
                    More Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkPreferencesUpdate({ events: true })}>
                    Enable Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkPreferencesUpdate({ events: false })}>
                    Disable Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedFollowers([])}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Followers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border-b font-medium text-sm">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={selectedFollowers.length === filteredFollowers.length && filteredFollowers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span>Follower</span>
              </div>
              <div className="flex items-center gap-8">
                <span>Status</span>
                <span>Tier</span>
                <span>Joined</span>
                <span>Actions</span>
              </div>
            </div>

            {filteredFollowers.map((follower) => (
              <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedFollowers.includes(follower.id)}
                    onCheckedChange={(checked) => handleSelectFollower(follower.id, checked as boolean)}
                  />
                  <div>
                    <p className="font-medium">
                      Follower {follower.subscriber_id.slice(0, 8)}...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {follower.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                    {follower.follow_status}
                  </Badge>
                  
                  <Badge variant={follower.tier_id ? 'default' : 'outline'}>
                    {follower.tier_id ? 'Premium' : 'Free'}
                  </Badge>
                  
                  <span className="text-sm text-muted-foreground">
                    {new Date(follower.created_at).toLocaleDateString()}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="h-4 w-4 mr-2" />
                        Toggle Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Follower
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredFollowers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No followers found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerManagementDashboard;
