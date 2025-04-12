
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { FeatureItem, MonthlyProgressData, ProgressSnapshot } from './types';

// Import our tab components
import OverviewTab from './tabs/OverviewTab';
import CategoriesTab from './tabs/CategoriesTab';
import ComparisonTab from './tabs/ComparisonTab';
import TimelineTab from './tabs/TimelineTab';

interface DevelopmentProgressDashboardProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures?: FeatureItem[];
  monthlyProgressData?: MonthlyProgressData[];
  confidenceScore?: number;
  currentSnapshot?: ProgressSnapshot;
}

/**
 * Helper function to calculate category progress 
 */
function calculateCategoryProgress(features: FeatureItem[]) {
  const totalFeatures = features.length;
  if (totalFeatures === 0) return { frontend: 0, backend: 0, overall: 0 };
  
  // Calculate backend progress
  const dbCompleted = features.filter(f => f.databaseStatus === 'complete' || f.dbStatus === 'implemented').length;
  const dbInProgress = features.filter(f => f.databaseStatus === 'in_progress' || f.dbStatus === 'in_progress').length;
  const backendPercentage = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Calculate frontend progress using implementation progress values
  const totalImplementationProgress = features.reduce((sum, feature) => {
    // Use the implementationProgress value if available, or infer from status
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    return sum + progress;
  }, 0);
  
  const frontendPercentage = Math.round(totalImplementationProgress / totalFeatures);
  
  return { 
    frontend: frontendPercentage, 
    backend: backendPercentage, 
    overall: Math.round((frontendPercentage + backendPercentage) / 2) 
  };
}

const DevelopmentProgressDashboard: React.FC<DevelopmentProgressDashboardProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures = [],
  monthlyProgressData = [],
  confidenceScore = 95,
  currentSnapshot
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  console.log("Dashboard props:", { 
    adminFeatures: adminFeatures?.length,
    establishmentFeatures: establishmentFeatures?.length,
    individualFeatures: individualFeatures?.length,
    promoterFeatures: promoterFeatures?.length,
    monthlyProgressData: monthlyProgressData?.length,
    currentSnapshot: currentSnapshot?.timestamp
  });
  
  // Combine all features for analysis
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  
  // Calculate overall implementation progress
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  
  // Use implementation progress values where available for a more accurate calculation
  const totalImplementationProgress = allFeatures.reduce((sum, feature) => {
    // Use the implementationProgress value if available, or infer from status
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    return sum + progress;
  }, 0);
  
  const overallProgressPercentage = Math.round(totalImplementationProgress / totalFeatures);
  
  // Calculate backend implementation progress (based on database status)
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'complete' || f.dbStatus === 'implemented').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in_progress' || f.dbStatus === 'in_progress').length;
  const backendProgressPercentage = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Calculate frontend progress using implementation progress
  const frontendProgressPercentage = Math.round(totalImplementationProgress / totalFeatures);

  // Calculate feature category implementation
  const adminProgress = calculateCategoryProgress(adminFeatures);
  const establishmentProgress = calculateCategoryProgress(establishmentFeatures);
  const individualProgress = calculateCategoryProgress(individualFeatures);
  const promoterProgress = calculateCategoryProgress(promoterFeatures);

  // Use provided monthly progress data or fall back to simple simulation
  const monthlyProgress = monthlyProgressData.length > 0 
    ? monthlyProgressData 
    : [
        { month: 'Jan', frontend: 10, backend: 5 },
        { month: 'Feb', frontend: 25, backend: 15 },
        { month: 'Mar', frontend: 40, backend: 30 },
        { month: 'Apr', frontend: 55, backend: 45 },
        { month: 'May', frontend: 70, backend: 60 },
        { month: 'Jun', frontend: 85, backend: 75 },
        { month: 'Jul', frontend: frontendProgressPercentage, backend: backendProgressPercentage }
      ].slice(0, new Date().getMonth() + 1);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Development Progress Dashboard
          {confidenceScore !== undefined && (
            <Badge 
              variant={confidenceScore >= 90 ? "outline" : confidenceScore >= 70 ? "secondary" : "destructive"}
              className="ml-2 flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {confidenceScore}% confidence
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Track frontend and backend implementation progress
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="comparison">FE/BE Comparison</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <OverviewTab
              overallProgressPercentage={overallProgressPercentage}
              frontendProgressPercentage={frontendProgressPercentage}
              backendProgressPercentage={backendProgressPercentage}
              implementedFeatures={implementedFeatures}
              partialFeatures={partialFeatures}
              totalFeatures={totalFeatures}
              confidenceScore={confidenceScore}
              currentSnapshot={currentSnapshot}
            />
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <CategoriesTab
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
              adminProgress={adminProgress}
              establishmentProgress={establishmentProgress}
              individualProgress={individualProgress}
              promoterProgress={promoterProgress}
            />
          </TabsContent>
          
          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <ComparisonTab
              frontendProgressPercentage={frontendProgressPercentage}
              backendProgressPercentage={backendProgressPercentage}
              confidenceScore={confidenceScore}
            />
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <TimelineTab
              monthlyProgress={monthlyProgress}
              confidenceScore={confidenceScore}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevelopmentProgressDashboard;
