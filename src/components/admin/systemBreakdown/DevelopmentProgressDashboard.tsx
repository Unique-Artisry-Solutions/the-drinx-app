
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3 } from 'lucide-react';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ImplementationStats } from './components/dashboard/ImplementationStats';
import { CategoryMetrics } from './components/dashboard/CategoryMetrics';
import { FeatureItem, MonthlyProgressData, ProgressSnapshot } from './types';
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

const DevelopmentProgressDashboard: React.FC<DevelopmentProgressDashboardProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures = [],
  monthlyProgressData = [],
  confidenceScore,
  currentSnapshot
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Calculate feature counts
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  const blockedFeatures = allFeatures.filter(f => f.status === 'blocked').length;
  const inProgressFeatures = allFeatures.filter(f => f.status === 'in_progress').length;

  // Calculate overall progress percentage
  const totalImplementationProgress = allFeatures.reduce((sum, feature) => {
    const progress = feature.implementationProgress ?? (
      feature.status === 'implemented' ? 100 :
      feature.status === 'partial' ? 65 :
      feature.status === 'in_progress' ? 45 :
      feature.status === 'blocked' ? 30 : 10
    );
    return sum + progress;
  }, 0);
  
  const overallProgressPercentage = Math.round(totalImplementationProgress / totalFeatures);
  const frontendProgressPercentage = Math.round(totalImplementationProgress / totalFeatures);
  const backendProgressPercentage = Math.round((totalImplementationProgress / totalFeatures) * 0.85);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Development Progress Dashboard
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <DashboardHeader 
          overallProgressPercentage={overallProgressPercentage}
          confidenceScore={confidenceScore}
        />
        
        <ImplementationStats 
          implementedFeatures={implementedFeatures}
          partialFeatures={partialFeatures}
          plannedFeatures={plannedFeatures}
          blockedFeatures={blockedFeatures}
          totalFeatures={totalFeatures}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="comparison">FE/BE Comparison</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab
              frontendProgressPercentage={frontendProgressPercentage}
              backendProgressPercentage={backendProgressPercentage}
              confidenceScore={confidenceScore}
              currentSnapshot={currentSnapshot}
              needsAttentionFeatures={allFeatures.filter(f => 
                f.status === 'partial' || 
                f.status === 'planned' || 
                f.status === 'blocked' || 
                f.status === 'in_progress'
              )}
            />
            <CategoryMetrics 
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesTab
              frontendProgressPercentage={frontendProgressPercentage}
              backendProgressPercentage={backendProgressPercentage}
              confidenceScore={confidenceScore}
            />
          </TabsContent>
          
          <TabsContent value="comparison">
            <ComparisonTab
              frontendProgressPercentage={frontendProgressPercentage}
              backendProgressPercentage={backendProgressPercentage}
              confidenceScore={confidenceScore}
            />
          </TabsContent>
          
          <TabsContent value="timeline">
            <TimelineTab
              monthlyProgress={monthlyProgressData}
              confidenceScore={confidenceScore}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DevelopmentProgressDashboard;
