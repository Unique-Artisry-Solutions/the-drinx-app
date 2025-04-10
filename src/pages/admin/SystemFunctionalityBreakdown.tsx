
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useSystemBreakdown } from '@/components/admin/systemBreakdown/hooks/useSystemBreakdown';
import StatusUpdateNotification from '@/components/admin/systemBreakdown/StatusUpdateNotification';
import SystemHeader from '@/components/admin/systemBreakdown/SystemHeader';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import FeatureTab from '@/components/admin/systemBreakdown/FeatureTab';
import ProposedImprovementsTab from '@/components/admin/systemBreakdown/ProposedImprovementsTab';
import AnalysisProgress from '@/components/admin/systemBreakdown/AnalysisProgress';
import ReleaseManagementTab from '@/components/admin/systemBreakdown/ReleaseManagementTab';
import CreateReleaseFromFeaturesButton from '@/components/admin/systemBreakdown/CreateReleaseFromFeaturesButton';
import FeatureShowcaseTab from '@/components/admin/systemBreakdown/FeatureShowcaseTab';
import { Award } from 'lucide-react';

// Import improvements data
import { proposedImprovements as improvementsData } from '@/components/admin/systemBreakdown/improvementsData';

const SystemFunctionalityBreakdown: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures,
    // Additional data for enhanced dashboard
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  } = useSystemBreakdown();

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <SystemHeader
          onAnalyzeFeatures={handleAnalyzeFeatures}
          onExportCSV={handleExportCSV}
          analyzing={analyzing}
        />

        {analyzing && (
          <AnalysisProgress
            progress={analysisProgress}
            steps={analysisSteps}
            analyzing={analyzing}
          />
        )}

        {updatedFeaturesCount > 0 && !analyzing && (
          <StatusUpdateNotification updatedFeaturesCount={updatedFeaturesCount} />
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admin">Admin Features</TabsTrigger>
            <TabsTrigger value="establishment">Establishment Features</TabsTrigger>
            <TabsTrigger value="individual">Individual Features</TabsTrigger>
            <TabsTrigger value="promoter">Promoter Features</TabsTrigger>
            <TabsTrigger value="improvements">Proposed Improvements</TabsTrigger>
            <TabsTrigger value="releases">Release Management</TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              Feature Showcase
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
              monthlyProgressData={monthlyProgressData}
              currentSnapshot={currentSnapshot}
              dataValidation={dataValidation}
            />
            <CreateReleaseFromFeaturesButton 
              onClick={handleCreateReleaseFromFeatures} 
            />
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <FeatureTab
              features={adminFeatures}
              title="Admin Features"
              description="Features accessible to system administrators and content managers"
            />
          </TabsContent>

          <TabsContent value="establishment" className="space-y-4">
            <FeatureTab
              features={establishmentFeatures}
              title="Establishment Features"
              description="Features accessible to bar, restaurant, and venue owners"
            />
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <FeatureTab
              features={individualFeatures}
              title="Individual User Features"
              description="Features accessible to regular users of the platform"
            />
          </TabsContent>

          <TabsContent value="promoter" className="space-y-4">
            <FeatureTab
              features={promoterFeatures}
              title="Promoter Features"
              description="Features accessible to event promoters and organizers"
            />
          </TabsContent>

          <TabsContent value="improvements" className="space-y-4">
            <ProposedImprovementsTab improvements={improvementsData} />
          </TabsContent>
          
          <TabsContent value="releases" className="space-y-4">
            <ReleaseManagementTab />
          </TabsContent>

          <TabsContent value="showcase" className="space-y-4">
            <FeatureShowcaseTab
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SystemFunctionalityBreakdown;
