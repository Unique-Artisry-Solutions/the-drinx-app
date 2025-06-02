
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { ReportControls } from './ReportControls';
import { DataPreview } from './DataPreview';
import { RecentExports } from './RecentExports';
import { 
  DateRange, 
  RecentExport, 
  ReportType,
  fetchPreviewData,
  exportReportData 
} from './exportUtils';

export function ReportExportUtility() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('user_points');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });
  const [preview, setPreview] = useState<any[]>([]);
  const [recentExports, setRecentExports] = useState<RecentExport[]>([
    {
      id: '1',
      type: 'User Points',
      date: format(new Date(), 'yyyy-MM-dd'),
      fileName: 'user_points_export_20250428.csv'
    }
  ]);
  
  const generatePreview = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPreviewData(reportType);
      setPreview(data);
      
      toast({
        title: "Preview Generated",
        description: `Showing a preview of ${reportType} report data`
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate report preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const { fileName, type } = await exportReportData(reportType);
      
      setRecentExports(prev => [{
        id: `export-${Date.now()}`,
        type,
        date: format(new Date(), 'yyyy-MM-dd'),
        fileName
      }, ...prev]);
      
      toast({
        title: "Export Successful",
        description: `Successfully exported ${reportType} data to ${fileName}`
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export the report data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Report Export Utility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ReportControls 
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onGeneratePreview={generatePreview}
            onExport={handleExport}
            isLoading={isLoading}
            hasPreviewData={preview.length > 0}
          />
          
          {preview.length > 0 && (
            <DataPreview preview={preview} />
          )}
          
          <RecentExports exports={recentExports} />
        </div>
      </CardContent>
    </Card>
  );
}
