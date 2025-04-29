
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

import { GuideHeader } from './GuideHeader';
import { GuideTabsList } from './GuideTabsList';
import { OverviewTabContent } from './tabs/OverviewTabContent';
import { ConfigurationTabContent } from './tabs/ConfigurationTabContent';
import { RulesTabContent } from './tabs/RulesTabContent';
import { BulkTabContent } from './tabs/BulkTabContent';
import { StatisticsTabContent } from './tabs/StatisticsTabContent';
import { ExportTabContent } from './tabs/ExportTabContent';

export function RewardsAdminGuide() {
  const [openTab, setOpenTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card>
      <GuideHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <Collapsible open={!isCollapsed}>
        <CollapsibleContent>
          <CardContent className="pt-4">
            <Tabs value={openTab} onValueChange={setOpenTab}>
              <GuideTabsList activeTab={openTab} />
            
              <TabsContent value="overview">
                <OverviewTabContent />
              </TabsContent>
              
              <TabsContent value="configuration">
                <ConfigurationTabContent />
              </TabsContent>
              
              <TabsContent value="rules">
                <RulesTabContent />
              </TabsContent>
              
              <TabsContent value="bulk">
                <BulkTabContent />
              </TabsContent>
              
              <TabsContent value="statistics">
                <StatisticsTabContent />
              </TabsContent>
              
              <TabsContent value="export">
                <ExportTabContent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
