
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SystemBreakdownNavigation from './SystemBreakdownNavigation';
import SystemHeader from './SystemHeader';
import OverviewTab from './OverviewTab';
import EnhancedFeatureTab from './EnhancedFeatureTab';
import FeatureShowcaseTab from './FeatureShowcaseTab';
import ComparisonTab from './tabs/ComparisonTab';
import TimelineTab from './tabs/TimelineTab';
import TabContentPlaceholder from '../TabContentPlaceholder';
import { useSystemBreakdown } from './hooks/useSystemBreakdown';

const SystemBreakdownContent: React.FC = () => {
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
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  } = useSystemBreakdown();

  console.log('SystemBreakdownContent: Rendering with activeTab:', activeTab);
  console.log('SystemBreakdownContent: Feature counts:', {
    admin: adminFeatures.length,
    establishment: establishmentFeatures.length,
    individual: individualFeatures.length,
    promoter: promoterFeatures.length
  });

  // Calculate mock progress percentages for tabs that need them
  const frontendProgressPercentage = 75;
  const backendProgressPercentage = 68;
  const confidenceScore = 85;

  return (
    <div className="space-y-6">
      <SystemHeader
        onAnalyzeFeatures={handleAnalyzeFeatures}
        onExportCSV={handleExportCSV}
        analyzing={analyzing}
      />

      <SystemBreakdownNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="min-h-[600px]">
        <TabsContent value="overview" className={activeTab === 'overview' ? 'block' : 'hidden'}>
          <OverviewTab
            adminFeatures={adminFeatures}
            establishmentFeatures={establishmentFeatures}
            individualFeatures={individualFeatures}
            promoterFeatures={promoterFeatures}
            analyzing={analyzing}
            analysisProgress={analysisProgress}
            analysisSteps={analysisSteps}
            updatedFeaturesCount={updatedFeaturesCount}
            onCreateRelease={handleCreateReleaseFromFeatures}
            progressHistory={progressHistory}
            monthlyProgressData={monthlyProgressData}
            currentSnapshot={currentSnapshot}
            dataValidation={dataValidation}
          />
        </TabsContent>

        <TabsContent value="admin" className={activeTab === 'admin' ? 'block' : 'hidden'}>
          <EnhancedFeatureTab
            features={adminFeatures}
            title="Admin Features"
            userType="admin"
          />
        </TabsContent>

        <TabsContent value="establishment" className={activeTab === 'establishment' ? 'block' : 'hidden'}>
          <EnhancedFeatureTab
            features={establishmentFeatures}
            title="Establishment Features"
            userType="establishment"
          />
        </TabsContent>

        <TabsContent value="individual" className={activeTab === 'individual' ? 'block' : 'hidden'}>
          <EnhancedFeatureTab
            features={individualFeatures}
            title="Individual User Features"
            userType="individual"
          />
        </TabsContent>

        <TabsContent value="promoter" className={activeTab === 'promoter' ? 'block' : 'hidden'}>
          <EnhancedFeatureTab
            features={promoterFeatures}
            title="Promoter Features"
            userType="promoter"
          />
        </TabsContent>

        <TabsContent value="promoter-requirements" className={activeTab === 'promoter-requirements' ? 'block' : 'hidden'}>
          <TabContentPlaceholder
            title="Promoter Requirements"
            description="Detailed requirements and specifications for promoter functionality are being developed."
          />
        </TabsContent>

        <TabsContent value="improvements" className={activeTab === 'improvements' ? 'block' : 'hidden'}>
          <TabContentPlaceholder
            title="Proposed Improvements"
            description="System improvement suggestions and enhancement proposals will be displayed here."
          />
        </TabsContent>

        <TabsContent value="releases" className={activeTab === 'releases' ? 'block' : 'hidden'}>
          <TabContentPlaceholder
            title="Release Management"
            description="Release planning, version control, and deployment management interface."
          />
        </TabsContent>

        <TabsContent value="comparison" className={activeTab === 'comparison' ? 'block' : 'hidden'}>
          <ComparisonTab
            frontendProgressPercentage={frontendProgressPercentage}
            backendProgressPercentage={backendProgressPercentage}
            confidenceScore={confidenceScore}
          />
        </TabsContent>

        <TabsContent value="timeline" className={activeTab === 'timeline' ? 'block' : 'hidden'}>
          <TimelineTab
            monthlyProgress={monthlyProgressData}
            confidenceScore={confidenceScore}
          />
        </TabsContent>

        <TabsContent value="showcase" className={activeTab === 'showcase' ? 'block' : 'hidden'}>
          <FeatureShowcaseTab
            adminFeatures={adminFeatures}
            establishmentFeatures={establishmentFeatures}
            individualFeatures={individualFeatures}
            promoterFeatures={promoterFeatures}
          />
        </TabsContent>
      </div>
    </div>
  );
};

export default SystemBreakdownContent;
