
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export function StatisticsTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Statistics Dashboard Guide</h3>
        <p>This section provides visual analytics and insights about your rewards program performance.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Key Metrics</h4>
          <p>The dashboard displays several important metrics:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Total Users:</strong> Number of users enrolled in the program</li>
            <li><strong>Active Users:</strong> Users who have earned or redeemed points recently</li>
            <li><strong>Average Points Balance:</strong> Mean points across all user accounts</li>
            <li><strong>Total Point Transactions:</strong> Volume of point activities</li>
            <li><strong>Redemption Rate:</strong> Percentage of earned points that get redeemed</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Chart Interpretations</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Points Earned vs. Redeemed:</strong> Balance between points entering and leaving the system</li>
            <li><strong>User Tier Distribution:</strong> Breakdown of users across different program tiers</li>
            <li><strong>Engagement Over Time:</strong> Trends in user participation</li>
            <li><strong>Top Earning Sources:</strong> Which activities generate the most points</li>
            <li><strong>Popular Redemptions:</strong> What rewards users choose most often</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Using the Statistics Dashboard</h4>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Use date filters to view data for specific periods</li>
            <li>Hover over chart elements to see detailed information</li>
            <li>Toggle between different visualization types when available</li>
            <li>Look for anomalies or trends that might indicate issues or opportunities</li>
          </ol>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Tip:</strong> Check the statistics dashboard regularly to identify patterns and optimize your reward program strategy.</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
