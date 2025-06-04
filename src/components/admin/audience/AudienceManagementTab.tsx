
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
import { Users, Target, TrendingUp, Network } from 'lucide-react';

export const AudienceManagementTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('segments');

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
                  <AudienceSegmentForm />
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
                  <CriteriaBuilder />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <AudienceSegmentList />
              <SegmentPerformance />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SegmentAnalyticsDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SegmentOverlapAnalysis />
            <SegmentTrendsChart />
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
              <ExportReportDialog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudienceManagementTab;
