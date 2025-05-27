
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Search,
  Filter,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FollowerList from './FollowerList';
import FollowerAnalyticsWidgets from './FollowerAnalyticsWidgets';
import FollowerNotificationCenter from './FollowerNotificationCenter';
import FollowerSystemHealthMonitor from './FollowerSystemHealthMonitor';
import FollowerMigrationWrapper from './FollowerMigrationWrapper';
import { FollowerFilters } from '@/types/FollowerComponentTypes';

interface FollowerDashboardProps {
  promoterId: string;
}

const FollowerDashboard: React.FC<FollowerDashboardProps> = ({ promoterId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FollowerFilters>({});
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleError = (error: Error) => {
    console.error('Follower dashboard error:', error);
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  };

  const handleSuccess = (data: any) => {
    console.log('Follower operation successful:', data);
  };

  const handleFilterChange = (newFilters: Partial<FollowerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <FollowerMigrationWrapper
      featureFlag="useNewFollowerSystem"
      migrationMessage="Using the new follower management system with enhanced features."
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Follower Management</h1>
            <p className="text-muted-foreground">Manage and engage with your followers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Followers
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FollowerAnalyticsWidgets
              promoterId={promoterId}
              onError={handleError}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FollowerList
                promoterId={promoterId}
                searchTerm={searchTerm}
                filters={filters}
                maxItems={5}
                showActions={false}
                onError={handleError}
                onSuccess={handleSuccess}
              />
              
              <FollowerNotificationCenter
                promoterId={promoterId}
                followerCount={0}
                onError={handleError}
                onSuccess={handleSuccess}
              />
            </div>
          </TabsContent>

          <TabsContent value="followers" className="space-y-6">
            <FollowerList
              promoterId={promoterId}
              searchTerm={searchTerm}
              filters={filters}
              showActions={true}
              onError={handleError}
              onSuccess={handleSuccess}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FollowerNotificationCenter
                promoterId={promoterId}
                followerCount={0}
                allowScheduling={true}
                onError={handleError}
                onSuccess={handleSuccess}
              />
              
              <FollowerAnalyticsWidgets
                promoterId={promoterId}
                detailed={true}
                onError={handleError}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <FollowerSystemHealthMonitor
              promoterId={promoterId}
              onError={handleError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </FollowerMigrationWrapper>
  );
};

export default FollowerDashboard;
