
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAdaptiveSubscriptions } from '@/hooks/useAdaptiveSubscriptions';
import FollowerList from './FollowerList';
import FollowerAnalyticsWidgets from './FollowerAnalyticsWidgets';
import FollowerNotificationCenter from './FollowerNotificationCenter';
import FollowerSystemHealthMonitor from '@/components/admin/FollowerSystemHealthMonitor';
import FollowerErrorBoundary from './FollowerErrorBoundary';
import { FollowerListSkeleton } from './FollowerLoadingStates';
import { Search, Users, Bell, BarChart3, Settings } from 'lucide-react';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';

interface FollowerDashboardProps extends FollowerComponentProps {
  // Dashboard-specific props can be added here
}

const FollowerDashboard: React.FC<FollowerDashboardProps> = ({ 
  promoterId,
  className = '',
  onError,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { 
    followers, 
    isLoading, 
    usingNewSystem,
    systemHealth,
    refetch
  } = useAdaptiveSubscriptions(promoterId);

  const followerCount = followers?.length || 0;

  const handleError = (err: Error) => {
    setError(err.message);
    onError?.(err);
  };

  const handleRetry = () => {
    setError(null);
    refetch();
  };

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <FollowerErrorBoundary 
          error={error} 
          onRetry={handleRetry}
          showDetails={true}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <FollowerListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follower Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your {followerCount.toLocaleString()} followers and engagement
            {usingNewSystem && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                New System
              </span>
            )}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Followers
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FollowerAnalyticsWidgets 
            promoterId={promoterId} 
            onError={handleError}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowerList 
                  promoterId={promoterId} 
                  searchTerm=""
                  maxItems={5}
                  onError={handleError}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowerNotificationCenter 
                  promoterId={promoterId} 
                  followerCount={followerCount}
                  onError={handleError}
                  onSuccess={onSuccess}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="followers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Followers</span>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search followers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FollowerList 
                promoterId={promoterId} 
                searchTerm={searchTerm}
                showActions={true}
                onError={handleError}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <FollowerNotificationCenter 
            promoterId={promoterId} 
            followerCount={followerCount}
            allowScheduling={true}
            onError={handleError}
            onSuccess={onSuccess}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FollowerAnalyticsWidgets 
            promoterId={promoterId} 
            detailed={true}
            onError={handleError}
          />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <FollowerSystemHealthMonitor 
            promoterId={promoterId}
            onError={handleError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerDashboard;
