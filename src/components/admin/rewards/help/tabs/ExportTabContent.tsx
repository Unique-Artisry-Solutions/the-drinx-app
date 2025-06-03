
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDown, FileText, Info } from "lucide-react";

export function ExportTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Export Guide</h3>
        <p>Export your analytics data for deeper analysis or reporting purposes.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Available Export Formats</h4>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>CSV:</strong> Standard format for spreadsheet analysis</li>
            <li><strong>JSON:</strong> Structured format for programmatic use</li>
            <li><strong>PDF Reports:</strong> Formatted reports with visualizations</li>
            <li><strong>Excel:</strong> Detailed workbooks with multiple sheets</li>
          </ul>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Export Limits</AlertTitle>
          <AlertDescription>
            Exports are limited to 100,000 records per request. For larger datasets, use date filters to break up the export into smaller chunks.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h4 className="font-medium">How to Export Data</h4>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Navigate to the analytics section you want to export</li>
            <li>Use filters to narrow down the data set if needed</li>
            <li>Click the export button <FileDown className="inline h-4 w-4" /> in the upper right corner</li>
            <li>Choose your preferred format</li>
            <li>Wait for the export to complete (larger datasets may take longer)</li>
            <li>Save the file to your computer when prompted</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Scheduled Reports</h4>
          <p>Set up automated exports to be delivered on a regular schedule:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Daily Reports:</strong> Sent at the end of each day</li>
            <li><strong>Weekly Summaries:</strong> Delivered each Monday</li>
            <li><strong>Monthly Analytics:</strong> Comprehensive reports at month-end</li>
            <li><strong>Custom Schedules:</strong> Define your own reporting cadence</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Tip:</strong> Use the <FileText className="inline h-4 w-4" /> Report Builder to customize the data included in scheduled exports.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Data Privacy Considerations</h4>
          <p>When exporting data, ensure you comply with all applicable privacy regulations:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Consider using anonymized exports for general analytics</li>
            <li>Ensure exported files are stored securely</li>
            <li>Delete exported files when they are no longer needed</li>
            <li>Be mindful of who has access to exported data</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}
