import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { AudienceSegment } from '@/types/AudienceTypes';

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments: AudienceSegment[];
}

interface ExportOptions {
  format: string;
  includeSegmentDetails: boolean;
  selectedMetrics: string[];
}

const ExportReportDialog = ({ open, onOpenChange, segments }: ExportReportDialogProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeSegmentDetails: true,
    selectedMetrics: ['members', 'conversionRate', 'engagementScore']
  });
  const [reportName, setReportName] = useState('');

  const handleExport = () => {
    console.log('Exporting report with options:', { reportName, ...exportOptions });
    onOpenChange(false);
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleMetricToggle = (metric: string) => {
    setExportOptions(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metric)
        ? prev.selectedMetrics.filter(m => m !== metric)
        : [...prev.selectedMetrics, metric]
    }));
  };

  const availableMetrics = [
    { value: 'members', label: 'Members' },
    { value: 'conversionRate', label: 'Conversion Rate' },
    { value: 'engagementScore', label: 'Engagement Score' },
    { value: 'growthRate', label: 'Growth Rate' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Customize your report export options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Report Name
            </Label>
            <Input id="name" value={reportName} onChange={(e) => setReportName(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              File Format
            </Label>
            <Select value={exportOptions.format} onValueChange={(value) => handleOptionChange('format', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="metrics" className="text-right mt-2">
              Metrics
            </Label>
            <div className="col-span-3 space-y-1">
              {availableMetrics.map(metric => (
                <div key={metric.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.value}
                    checked={exportOptions.selectedMetrics.includes(metric.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleMetricToggle(metric.value);
                      } else {
                        handleMetricToggle(metric.value);
                      }
                    }}
                  />
                  <Label htmlFor={metric.value}>{metric.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">
              Segment Details
            </Label>
            <div className="col-span-3">
              <Checkbox
                id="details"
                checked={exportOptions.includeSegmentDetails}
                onCheckedChange={(checked) => handleOptionChange('includeSegmentDetails', checked)}
              />
              <Label htmlFor="details" className="ml-2">Include segment definitions</Label>
            </div>
          </div>

          <div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Segments</TabsTrigger>
                <TabsTrigger value="selected">Selected Segments</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport}>
            Export Report <Download className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportDialog;
