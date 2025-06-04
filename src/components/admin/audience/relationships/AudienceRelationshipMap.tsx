
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NetworkVisualization from './NetworkVisualization';
import { InfluencerList } from './InfluencerList';
import RelationshipMatrix from './RelationshipMatrix';
import { InfluentialUser } from '@/types/AudienceTypes';
import { Network, Users, BarChart3, Download, RefreshCw } from 'lucide-react';

export const AudienceRelationshipMap: React.FC = () => {
  const [activeView, setActiveView] = useState('network');
  const [isLoading, setIsLoading] = useState(false);

  // Mock influencers data
  const influencers: InfluentialUser[] = [
    {
      user_id: '1',
      display_name: 'Sarah Chen',
      influence_score: 95,
      follower_count: 12500,
      engagement_rate: 8.5,
      connected_segments: 4,
      expertise_areas: ['cocktails', 'events']
    },
    {
      user_id: '2',
      display_name: 'Mike Rodriguez',
      influence_score: 87,
      follower_count: 8900,
      engagement_rate: 7.2,
      connected_segments: 3,
      expertise_areas: ['bar crawls', 'social']
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting relationship data...');
  };

  const handleSelectUser = (userId: string) => {
    console.log('Selected user:', userId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Audience Relationship Mapping
              </CardTitle>
              <CardDescription>
                Visualize and analyze relationships between audience members and segments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {isLoading ? 'Updating...' : 'Live Data'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Network View
              </TabsTrigger>
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Matrix View
              </TabsTrigger>
              <TabsTrigger value="influencers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Influencers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-4">
              <NetworkVisualization />
            </TabsContent>

            <TabsContent value="matrix" className="mt-4">
              <RelationshipMatrix />
            </TabsContent>

            <TabsContent value="influencers" className="mt-4">
              <InfluencerList 
                influencers={influencers}
                onSelectUser={handleSelectUser}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceRelationshipMap;
