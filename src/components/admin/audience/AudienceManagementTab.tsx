
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { AudienceSegmentList } from './AudienceSegmentList';
import { SegmentAnalyticsDashboard } from './analytics/SegmentAnalyticsDashboard';
import { NetworkVisualization } from './relationships/NetworkVisualization';

export const AudienceManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  // Mock data - preserved as placeholder for future functionality
  const audienceStats = {
    totalUsers: 12456,
    activeSegments: 8,
    engagementRate: '73.2%',
    growthRate: '+12.5%'
  };

  const handleCreateSegment = () => {
    console.log('Creating new audience segment');
  };

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audience Management</h2>
          <p className="text-muted-foreground">Manage and analyze your audience segments</p>
        </div>
        <Button onClick={handleCreateSegment}>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audienceStats.totalUsers.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">{audienceStats.growthRate}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audienceStats.activeSegments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audienceStats.engagementRate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{audienceStats.growthRate}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <AudienceSegmentList 
            searchTerm={searchTerm}
            selectedSegments={selectedSegments}
            onSegmentSelect={handleSegmentSelect}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SegmentAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <NetworkVisualization 
            network={{ nodes: [], edges: [] }}
            zoomLevel={1}
            filterThreshold={0.5}
            onNodeSelect={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
