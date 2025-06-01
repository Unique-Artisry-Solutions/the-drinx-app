
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CheckCircle, Download, File, FileText } from 'lucide-react';

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments: AudienceSegment[];
  selectedSegments: string[];
  onSegmentToggle: (segmentId: string) => void;
  dateRange?: DateRange;
}

export function ExportReportDialog({
  open,
  onOpenChange,
  segments,
  selectedSegments,
  onSegmentToggle,
  dateRange
}: ExportReportDialogProps) {
  const [reportType, setReportType] = useState<'performance' | 'overlap' | 'detailed'>('performance');
  const [fileFormat, setFileFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setExportSuccess(false);
        onOpenChange(false);
        
        // Show success toast
        toast(
          "Report exported successfully",
          {
            description: `The ${reportType} report has been exported as a ${fileFormat.toUpperCase()} file.`,
            action: {
              label: "Download",
              onClick: () => console.log("Download clicked")
            }
          }
        );
      }, 1500);
    }, 2000);
  };
  
  // Get file icon based on format
  const getFileIcon = () => {
    switch (fileFormat) {
      case 'pdf':
        return <File className="h-6 w-6 text-red-500" />;
      case 'excel':
        return <FileText className="h-6 w-6 text-green-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Segment Report</DialogTitle>
          <DialogDescription>
            Create a customized report of your audience segment data
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {exportSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium">Export Successful</p>
              <p className="text-sm text-muted-foreground text-center">
                Your report has been generated and is ready for download
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance Metrics</SelectItem>
                    <SelectItem value="overlap">Segment Overlap Analysis</SelectItem>
                    <SelectItem value="detailed">Detailed Segment Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-format">File Format</Label>
                <Tabs 
                  defaultValue={fileFormat} 
                  value={fileFormat}
                  onValueChange={(v) => setFileFormat(v as any)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="csv">CSV</TabsTrigger>
                    <TabsTrigger value="excel">Excel</TabsTrigger>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="text-sm p-2 border rounded-md bg-muted/50">
                  {dateRange?.from ? (
                    <>
                      <span className="font-medium">From:</span> {format(dateRange.from, 'PPP')}
                      <br />
                      <span className="font-medium">To:</span> {format(dateRange.to || new Date(), 'PPP')}
                    </>
                  ) : (
                    'No date range selected - using all available data'
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Include Segments</Label>
                <div className="max-h-[150px] overflow-y-auto space-y-2 p-2">
                  {segments.map(segment => (
                    <div key={segment.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`export-${segment.id}`}
                        checked={selectedSegments.includes(segment.id)}
                        onCheckedChange={() => onSegmentToggle(segment.id)}
                      />
                      <Label 
                        htmlFor={`export-${segment.id}`}
                        className="cursor-pointer"
                      >
                        {segment.name}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {selectedSegments.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Please select at least one segment to include in the report
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          {exportSuccess ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {getFileIcon()}
              <span className="text-sm font-medium">
                segment-report-{format(new Date(), 'yyyyMMdd')}.{fileFormat}
              </span>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleExport}
                disabled={selectedSegments.length === 0 || isExporting}
                className="gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export Report
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
