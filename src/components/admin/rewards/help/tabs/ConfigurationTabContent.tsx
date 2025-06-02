
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export function ConfigurationTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuration Guide</h3>
        <p>This section allows you to customize core settings of your rewards program.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">General Settings</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Program Status:</strong> Enable or disable the entire rewards program</li>
            <li><strong>Tier Analytics:</strong> Toggle tracking of tier progression metrics</li>
            <li><strong>Points Expiration:</strong> Set how many days before points expire (0 for never)</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Pro Tip:</strong> Disabling the program temporarily can be useful during maintenance or when making significant changes.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Point Earning Settings</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Points per Dollar:</strong> Points awarded per dollar spent</li>
            <li><strong>Signup Bonus:</strong> One-time points awarded to new users</li>
            <li><strong>Referral Bonus:</strong> Points awarded for successful referrals</li>
            <li><strong>Check-in Points:</strong> Points awarded when users check in</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Redemption Settings</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Minimum Redemption:</strong> Minimum points needed for any redemption</li>
            <li><strong>Redemption Rules:</strong> Special conditions for point redemption</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Best Practice:</strong> Set redemption minimums that encourage users to engage more with your platform.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">How to Save Changes</h4>
          <p>After making changes to any configuration settings:</p>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Review your changes for accuracy</li>
            <li>Click the "Save Changes" button at the top of the card</li>
            <li>Wait for confirmation that settings have been updated</li>
          </ol>
        </div>
      </div>
    </ScrollArea>
  );
}
