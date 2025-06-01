
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export function BulkTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Bulk Operations Guide</h3>
        <p>This section allows you to add or subtract points for multiple users simultaneously.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Using Bulk Operations</h4>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Select an operation type:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li><strong>Add Points:</strong> Add points to user accounts</li>
                <li><strong>Subtract Points:</strong> Deduct points from user accounts</li>
              </ul>
            </li>
            <li>Provide user data in CSV format:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Either upload a CSV file</li>
                <li>Or manually enter data in the text area</li>
              </ul>
            </li>
            <li>Click "Execute Bulk Operation" to process</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">CSV Format Requirements</h4>
          <p>Your CSV data should follow this format:</p>
          <div className="font-mono text-sm p-3 bg-muted/30 rounded-md">
            userId,points,source,metadata
          </div>
          
          <p className="mt-2">For example:</p>
          <div className="font-mono text-sm p-3 bg-muted/30 rounded-md">
            user-123,100,promotion,{`{"campaign":"summer"}`}<br/>
            user-456,50,bonus,{`{"reason":"loyalty"}`}
          </div>
          
          <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
            <li><strong>userId:</strong> Unique identifier for the user</li>
            <li><strong>points:</strong> Number of points to add/subtract</li>
            <li><strong>source:</strong> Reason for the point change</li>
            <li><strong>metadata:</strong> Optional JSON object with additional information</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Tips for Bulk Operations</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Always verify your CSV data before submission</li>
            <li>Use meaningful source values for audit purposes</li>
            <li>Keep backup records of large point adjustments</li>
            <li>Review results after completion to verify success</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Note:</strong> For very large datasets (1000+ users), consider breaking them into smaller batches for better performance.</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
