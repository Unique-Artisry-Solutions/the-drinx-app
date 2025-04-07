
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

// Import refactored components
import SystemHeader from '@/components/admin/systemBreakdown/SystemHeader';
import StatusUpdateNotification from '@/components/admin/systemBreakdown/StatusUpdateNotification';
import ImplementationOverview from '@/components/admin/systemBreakdown/ImplementationOverview';
import OverviewTab from '@/components/admin/systemBreakdown/OverviewTab';
import FeatureTab from '@/components/admin/systemBreakdown/FeatureTab';
import ProposedImprovementsTab from '@/components/admin/systemBreakdown/ProposedImprovementsTab';
import AnalysisProgress from '@/components/admin/systemBreakdown/AnalysisProgress';
import { useSystemBreakdown } from '@/components/admin/systemBreakdown/hooks/useSystemBreakdown';
import { proposedImprovements } from '@/components/admin/systemBreakdown/improvementsData';

const SystemFunctionalityBreakdown: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    adminFeatures,
    establishmentFeatures, 
    individualFeatures,
    analyzing,
    analysisProgress,
    analysisSteps,
    updatedFeaturesCount,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures
  } = useSystemBreakdown();

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <SystemHeader 
          onAnalyzeFeatures={handleAnalyzeFeatures}
          onExportCSV={handleExportCSV}
          analyzing={analyzing}
        />
        
        <StatusUpdateNotification updatedFeaturesCount={updatedFeaturesCount} />
        
        <AnalysisProgress 
          analyzing={analyzing}
          steps={analysisSteps}
          progress={analysisProgress}
        />

        <ImplementationOverview 
          adminFeatures={adminFeatures}
          establishmentFeatures={establishmentFeatures}
          individualFeatures={individualFeatures}
        />

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admin">Admin Features</TabsTrigger>
            <TabsTrigger value="establishment">Establishment Features</TabsTrigger>
            <TabsTrigger value="individual">Individual Features</TabsTrigger>
            <TabsTrigger value="improvements" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Proposed Improvements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
            />
          </TabsContent>

          <TabsContent value="admin">
            <FeatureTab 
              features={adminFeatures}
              title="Admin Features"
              description="Features available to system administrators for managing the platform"
            />
          </TabsContent>

          <TabsContent value="establishment">
            <FeatureTab 
              features={establishmentFeatures}
              title="Establishment Features"
              description="Features available to registered establishments on the platform"
            />
          </TabsContent>

          <TabsContent value="individual">
            <FeatureTab 
              features={individualFeatures}
              title="Individual User Features"
              description="Features available to regular users of the platform"
            />
          </TabsContent>

          <TabsContent value="improvements">
            <ProposedImprovementsTab improvements={proposedImprovements} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SystemFunctionalityBreakdown;
