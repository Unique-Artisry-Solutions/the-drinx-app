
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AudienceSegmentForm } from './AudienceSegmentForm';
import { AudienceSegmentList } from './AudienceSegmentList';
import { CriteriaBuilder } from './CriteriaBuilder';
import { SegmentPerformance } from './SegmentPerformance';
import { AudienceInsights } from './AudienceInsights';
import { AudienceRelationshipMap } from './relationships/AudienceRelationshipMap';
import { SegmentOverlapAnalysis } from './analytics/SegmentOverlapAnalysis';
import { SegmentTrendsChart } from './analytics/SegmentTrendsChart';
import { ExportReportDialog } from './analytics/ExportReportDialog';
import SegmentAnalyticsDashboard from './analytics/SegmentAnalyticsDashboard';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Users, Target, TrendingUp, Network } from 'lucide-react';

export const AudienceManagementTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('segments');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Mock data and state
  const [segments] = useState<AudienceSegment[]>([
    {
      id: '1',
      name: 'High-Value Customers',
      description: 'Customers with high engagement and purchase history',
      created_by: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      memberCount: 1250
    },
    {
      id: '2',
      name: 'New Users',
      description: 'Users who joined in the last 30 days',
      created_by: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      memberCount: 890
    }
  ]);
  
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [isLoading] = useState(false);

  // Event handlers
  const handleSegmentSubmit = (data: { name: string; description: string }) => {
    console.log('Creating segment:', data);
  };

  const handleSegmentCancel = () => {
    console.log('Segment creation cancelled');
  };

  const handleAddCriterion = (criterion: { type: string; operator: string; value: string }) => {
    console.log('Adding criterion:', criterion);
  };

  const handleEditSegment = (segment: AudienceSegment) => {
    console.log('Editing segment:', segment);
  };

  const handleDeleteSegment = (segmentId: string) => {
    console.log('Deleting segment:', segmentId);
  };

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Audience Management</h2>
        <p className="text-muted-foreground">
          Create, manage, and analyze your audience segments and relationships.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Relationships
          </TabsTrigger>
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Targeting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Segment</CardTitle>
                  <CardDescription>
                    Define audience segments based on user behavior and demographics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AudienceSegmentForm 
                    onSubmit={handleSegmentSubmit}
                    onCancel={handleSegmentCancel}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Criteria Builder</CardTitle>
                  <CardDescription>
                    Build complex segmentation rules and conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CriteriaBuilder onAddCriterion={handleAddCriterion} />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <AudienceSegmentList 
                segments={segments}
                isLoading={isLoading}
                onEdit={handleEditSegment}
                onDelete={handleDeleteSegment}
              />
              <SegmentPerformance segments={segments} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SegmentAnalyticsDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SegmentOverlapAnalysis 
              segments={segments}
              selectedSegments={selectedSegments}
              onSegmentToggle={handleSegmentToggle}
              isLoading={isLoading}
            />
            <SegmentTrendsChart 
              segments={segments}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <AudienceRelationshipMap />
          <AudienceInsights />
        </TabsContent>

        <TabsContent value="targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>
                Generate and export detailed audience reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportReportDialog 
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                segments={segments}
                selectedSegments={selectedSegments}
                onSegmentToggle={handleSegmentToggle}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudienceManagementTab;
