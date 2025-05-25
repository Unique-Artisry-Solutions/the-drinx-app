
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemHeader from './SystemHeader';
import OverviewTab from './OverviewTab';
import EnhancedFeatureTab from './EnhancedFeatureTab';
import FeatureShowcaseTab from './FeatureShowcaseTab';
import ComparisonTab from './tabs/ComparisonTab';
import TimelineTab from './tabs/TimelineTab';
import PromoterRequirementsTab from './tabs/PromoterRequirementsTab';
import ProposedImprovementsTab from './tabs/ProposedImprovementsTab';
import ReleaseManagementTab from './tabs/ReleaseManagementTab';
import { useSystemBreakdown } from './hooks/useSystemBreakdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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

  const isMobile = useIsMobile();

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

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'admin', label: 'Admin' },
    { value: 'establishment', label: 'Establishments' },
    { value: 'individual', label: 'Users' },
    { value: 'promoter', label: 'Promoters' },
    { value: 'promoter-requirements', label: 'Requirements' },
    { value: 'improvements', label: 'Improvements' },
    { value: 'releases', label: 'Releases' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'showcase', label: 'Showcase' }
  ];

  return (
    <div className="space-y-6">
      <SystemHeader
        onAnalyzeFeatures={handleAnalyzeFeatures}
        onExportCSV={handleExportCSV}
        analyzing={analyzing}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Navigation Tabs */}
        <div className="sticky top-4 z-10 bg-card rounded-lg p-1 shadow-sm mb-6 overflow-x-auto">
          {isMobile ? (
            <div className="flex space-x-2 min-w-max px-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-full whitespace-nowrap transition-colors",
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background border border-border hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <TabsList className="w-full justify-start gap-1 bg-transparent p-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    activeTab === tab.value ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <TabsContent value="overview">
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

          <TabsContent value="admin">
            <EnhancedFeatureTab
              features={adminFeatures}
              title="Admin Features"
              userType="admin"
            />
          </TabsContent>

          <TabsContent value="establishment">
            <EnhancedFeatureTab
              features={establishmentFeatures}
              title="Establishment Features"
              userType="establishment"
            />
          </TabsContent>

          <TabsContent value="individual">
            <EnhancedFeatureTab
              features={individualFeatures}
              title="Individual User Features"
              userType="individual"
            />
          </TabsContent>

          <TabsContent value="promoter">
            <EnhancedFeatureTab
              features={promoterFeatures}
              title="Promoter Features"
              userType="promoter"
            />
          </TabsContent>

          <TabsContent value="promoter-requirements">
            <PromoterRequirementsTab />
          </TabsContent>

          <TabsContent value="improvements">
            <ProposedImprovementsTab />
          </TabsContent>

          <TabsContent value="releases">
            <ReleaseManagementTab />
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

          <TabsContent value="showcase">
            <FeatureShowcaseTab
              adminFeatures={adminFeatures}
              establishmentFeatures={establishmentFeatures}
              individualFeatures={individualFeatures}
              promoterFeatures={promoterFeatures}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownContent;
