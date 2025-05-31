
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { GuideHeader } from './GuideHeader';
import { GuideTabsList } from './GuideTabsList';
import { OverviewTabContent } from './tabs/OverviewTabContent';
import { ConfigurationTabContent } from './tabs/ConfigurationTabContent';
import { RulesTabContent } from './tabs/RulesTabContent';
import { StatisticsTabContent } from './tabs/StatisticsTabContent';
import { BulkTabContent } from './tabs/BulkTabContent';
import { ExportTabContent } from './tabs/ExportTabContent';

export function RewardsAdminGuide() {
  const guideTabs = [
    { value: 'overview', label: 'Overview', badge: 'New' },
    { value: 'configuration', label: 'Config' },
    { value: 'rules', label: 'Rules' },
    { value: 'statistics', label: 'Stats' },
    { value: 'bulk', label: 'Bulk Ops' },
    { value: 'export', label: 'Export' }
  ];

  return (
    <div className="space-y-6">
      <GuideHeader
        title="Rewards Administration Guide"
        description="Complete guide to managing reward programs, configurations, and analytics"
        version="2.1"
        lastUpdated="March 15, 2024"
      />

      <Tabs defaultValue="overview" className="w-full">
        <GuideTabsList tabs={guideTabs} />

        <TabsContent value="overview" className="mt-6">
          <OverviewTabContent />
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          <ConfigurationTabContent />
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <RulesTabContent />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <StatisticsTabContent />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkTabContent />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
