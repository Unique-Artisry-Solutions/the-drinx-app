
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export function ExportTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Report Export Guide</h3>
        <p>This section allows you to generate and export detailed reports about your rewards program.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Available Report Types</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>User Points:</strong> Current point balances for all users</li>
            <li><strong>Reward Redemptions:</strong> History of all reward redemptions</li>
            <li><strong>Point Transactions:</strong> Detailed log of point activities</li>
            <li><strong>Tier Distribution:</strong> Breakdown of users by tier level</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Generating Reports</h4>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Select the report type you need</li>
            <li>Specify a date range if applicable</li>
            <li>Click "Generate Preview" to see a sample of the data</li>
            <li>Review the preview to ensure it contains the information you need</li>
            <li>Click "Export Full Report" to download the complete dataset</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Working with Exported Reports</h4>
          <p>Exported reports are delivered as CSV files that can be:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Opened in spreadsheet applications like Excel or Google Sheets</li>
            <li>Imported into data analysis tools</li>
            <li>Archived for record-keeping and compliance</li>
            <li>Shared with team members or stakeholders</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Best Practice:</strong> Schedule regular exports of critical reports for backup purposes and trend analysis.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Troubleshooting</h4>
          <p>If you encounter issues with report exports:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Verify your date range is valid</li>
            <li>Try exporting a smaller date range if the report is too large</li>
            <li>Check for any system notifications about maintenance or downtime</li>
            <li>Refresh the page and try again if the export button is unresponsive</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}
