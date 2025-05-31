import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from 'react-day-picker';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Download, FileText, Table } from 'lucide-react';

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
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeMetrics, setIncludeMetrics] = useState(true);

  const handleExport = () => {
    // Export functionality placeholder
    console.log('Exporting report:', {
      format: exportFormat,
      segments: selectedSegments,
      dateRange,
      includeMetrics
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Segment Analytics Report</DialogTitle>
          <DialogDescription>
            Configure your export settings and select segments to include in the report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <Tabs value={exportFormat} onValueChange={setExportFormat} className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="excel" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Excel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label className="text-base font-medium">Report Options</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metrics"
                  checked={includeMetrics}
                  onCheckedChange={setIncludeMetrics}
                />
                <Label htmlFor="include-metrics">Include performance metrics</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Segments to Include</Label>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
              {segments.map((segment) => (
                <div key={segment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={segment.id}
                    checked={selectedSegments.includes(segment.id)}
                    onCheckedChange={() => onSegmentToggle(segment.id)}
                  />
                  <Label htmlFor={segment.id}>{segment.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Date Range</Label>
            <Select defaultValue="custom">
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
