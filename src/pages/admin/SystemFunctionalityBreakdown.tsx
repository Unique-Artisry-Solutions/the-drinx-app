
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
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
import PromoterRequirementsTab from '@/components/admin/systemBreakdown/PromoterRequirementsTab';
import SystemBreakdownNavigation, { MobileSystemBreakdownNavigation } from '@/components/admin/systemBreakdown/SystemBreakdownNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // Use mobile hook to determine if we're on mobile
  const isMobile = useIsMobile();

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

        {/* Use appropriate navigation based on screen size */}
        {isMobile ? (
          <MobileSystemBreakdownNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <SystemBreakdownNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        <div className="space-y-4">
          {/* Overview Tab */}
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

          {/* Admin Features Tab */}
          <TabsContent value="admin" className="space-y-4">
            <FeatureTab
              features={adminFeatures}
              title="Admin Features"
              description="Features accessible to system administrators and content managers"
            />
          </TabsContent>

          {/* Establishment Features Tab */}
          <TabsContent value="establishment" className="space-y-4">
            <FeatureTab
              features={establishmentFeatures}
              title="Establishment Features"
              description="Features accessible to bar, restaurant, and venue owners"
            />
          </TabsContent>

          {/* Individual Features Tab */}
          <TabsContent value="individual" className="space-y-4">
            <FeatureTab
              features={individualFeatures}
              title="Individual User Features"
              description="Features accessible to regular users of the platform"
            />
          </TabsContent>

          {/* Promoter Features Tab */}
          <TabsContent value="promoter" className="space-y-4">
            <FeatureTab
              features={promoterFeatures}
              title="Promoter Features"
              description="Features accessible to event promoters and organizers"
            />
          </TabsContent>
          
          {/* Promoter Requirements Tab */}
          <TabsContent value="promoter-requirements" className="space-y-4">
            <PromoterRequirementsTab features={promoterFeatures} />
          </TabsContent>

          {/* Proposed Improvements Tab */}
          <TabsContent value="improvements" className="space-y-4">
            <ProposedImprovementsTab improvements={improvementsData} />
          </TabsContent>
          
          {/* Release Management Tab */}
          <TabsContent value="releases" className="space-y-4">
            <ReleaseManagementTab />
          </TabsContent>

          {/* Feature Showcase Tab */}
          <TabsContent value="showcase" className="space-y-4">
            <FeatureShowcaseTab
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
            />
          </TabsContent>
        </div>
      </div>
    </Layout>
  );
};

export default SystemFunctionalityBreakdown;
