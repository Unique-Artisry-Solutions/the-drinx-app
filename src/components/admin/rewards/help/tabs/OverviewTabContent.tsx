
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function OverviewTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rewards Program Administration</h3>
        <p>Welcome to the Rewards Program Administration panel. This guide will help you navigate and use the various tools available for managing your rewards program.</p>
        
        <Alert variant="default" className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            The administration panel is divided into five main sections: Configuration, Rules Management, Bulk Operations, Statistics, and Export Reports.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h4 className="font-medium">Getting Started</h4>
          <p>To begin managing your rewards program:</p>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Start by reviewing and updating your program configuration settings</li>
            <li>Set up reward rules to define how users earn points</li>
            <li>Use bulk operations for mass point adjustments when needed</li>
            <li>Monitor program performance through the statistics dashboard</li>
            <li>Generate reports for detailed analysis and record-keeping</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Key Concepts</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Points:</strong> The currency of your rewards program</li>
            <li><strong>Rules:</strong> Conditions that trigger point earning or redemption</li>
            <li><strong>Tiers:</strong> Levels users can achieve based on their activity</li>
            <li><strong>Redemptions:</strong> When users exchange points for rewards</li>
          </ul>
        </div>
        
        <p>Select a specific section from the tabs above to learn more about each feature.</p>
      </div>
    </ScrollArea>
  );
}
