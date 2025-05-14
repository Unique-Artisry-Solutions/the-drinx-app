
import React, { useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSystemBreakdown } from '@/components/admin/systemBreakdown/hooks/useSystemBreakdown';
import StatusUpdateNotification from '@/components/admin/systemBreakdown/StatusUpdateNotification';
import SystemHeader from '@/components/admin/systemBreakdown/SystemHeader';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import { EnhancedFeatureTab } from '@/components/admin/systemBreakdown/EnhancedFeatureTab';
import ProposedImprovementsTab from '@/components/admin/systemBreakdown/ProposedImprovementsTab';
import AnalysisProgress from '@/components/admin/systemBreakdown/AnalysisProgress';
import ReleaseManagementTab from '@/components/admin/systemBreakdown/ReleaseManagementTab';
import CreateReleaseFromFeaturesButton from '@/components/admin/systemBreakdown/CreateReleaseFromFeaturesButton';
import FeatureShowcaseTab from '@/components/admin/systemBreakdown/FeatureShowcaseTab';
import PromoterRequirementsTab from '@/components/admin/systemBreakdown/PromoterRequirementsTab';
import SystemBreakdownNavigation, { MobileSystemBreakdownNavigation } from '@/components/admin/systemBreakdown/SystemBreakdownNavigation';
import SystemHealthCheck from '@/components/admin/systemBreakdown/components/SystemHealthCheck';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import improvements data
import { proposedImprovements as improvementsData } from '@/components/admin/systemBreakdown/improvementsData';

const SystemFunctionalityBreakdown: React.FC = () => {
  const navigate = useNavigate();
  
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
    monthlyProgressData,
    currentSnapshot,
    dataValidation
  } = useSystemBreakdown();
  
  useEffect(() => {
    console.log('SystemFunctionalityBreakdown rendered with active tab:', activeTab);
  }, [activeTab]);
  
  const handleConfigureFeatures = () => {
    navigate('/admin/system-configuration?tab=features');
  };
  
  const isMobile = useIsMobile();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <SystemHeader
          onAnalyzeFeatures={handleAnalyzeFeatures}
          onExportCSV={handleExportCSV}
          analyzing={analyzing}
        />
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleConfigureFeatures}
        >
          <Settings className="h-4 w-4" />
          Configure Features
        </Button>
      </div>

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

      {isMobile ? (
        <MobileSystemBreakdownNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <SystemBreakdownNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <Tabs value={activeTab} className="space-y-4">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OverviewTab
                adminFeatures={adminFeatures}
                establishmentFeatures={establishmentFeatures}
                individualFeatures={individualFeatures}
                promoterFeatures={promoterFeatures}
                monthlyProgressData={monthlyProgressData}
                currentSnapshot={currentSnapshot}
                dataValidation={dataValidation}
              />
            </div>
            <div>
              <SystemHealthCheck
                dataValidation={dataValidation}
                currentSnapshot={currentSnapshot}
              />
            </div>
          </div>
          <CreateReleaseFromFeaturesButton 
            onClick={handleCreateReleaseFromFeatures} 
          />
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <EnhancedFeatureTab
            features={adminFeatures}
            title="Admin Features"
            description="Features accessible to system administrators and content managers"
          />
        </TabsContent>

        <TabsContent value="establishment" className="space-y-4">
          <EnhancedFeatureTab
            features={establishmentFeatures}
            title="Establishment Features"
            description="Features accessible to bar, restaurant, and venue owners"
          />
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <EnhancedFeatureTab
            features={individualFeatures}
            title="Individual User Features"
            description="Features accessible to regular users of the platform"
          />
        </TabsContent>

        <TabsContent value="promoter" className="space-y-4">
          <EnhancedFeatureTab
            features={promoterFeatures}
            title="Promoter Features"
            description="Features accessible to event promoters and organizers"
          />
        </TabsContent>
        
        <TabsContent value="promoter-requirements" className="space-y-4">
          <PromoterRequirementsTab features={promoterFeatures} />
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
  );
};

export default SystemFunctionalityBreakdown;
