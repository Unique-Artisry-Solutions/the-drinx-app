
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileText, Download, Save, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const metricOptions = [
  { label: 'User Engagement', value: 'user_engagement' },
  { label: 'Points Earned', value: 'points_earned' },
  { label: 'Points Redeemed', value: 'points_redeemed' },
  { label: 'Active Users', value: 'active_users' },
  { label: 'New Users', value: 'new_users' },
  { label: 'Redemption Rate', value: 'redemption_rate' },
  { label: 'Average Points per User', value: 'avg_points_per_user' },
];

const ReportBuilderComponent = () => {
  const { toast } = useToast();
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState('last_30_days');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState('pdf');

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(current => 
      current.includes(metric)
        ? current.filter(m => m !== metric)
        : [...current, metric]
    );
  };

  const handleGenerateReport = () => {
    if (!reportName) {
      toast({
        title: "Report Name Required",
        description: "Please provide a name for your report.",
        variant: "destructive"
      });
      return;
    }

    if (selectedMetrics.length === 0) {
      toast({
        title: "No Metrics Selected",
        description: "Please select at least one metric to include in your report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulating report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Report Generated",
        description: `Your report "${reportName}" has been generated successfully.`,
      });
      
      if (saveAsTemplate) {
        toast({
          title: "Template Saved",
          description: "This report configuration has been saved as a template.",
        });
      }
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Custom Report Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="report-name">Report Name</Label>
              <Input 
                id="report-name" 
                placeholder="Monthly Performance Summary" 
                value={reportName} 
                onChange={(e) => setReportName(e.target.value)} 
              />
            </div>
            
            <div>
              <Label>Time Period</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {timeframe === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            )}
            
            <div>
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="save-template" 
                checked={saveAsTemplate} 
                onCheckedChange={(checked) => setSaveAsTemplate(checked === true)} 
              />
              <Label htmlFor="save-template">Save as report template</Label>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Select Metrics</Label>
            <div className="border rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
              {metricOptions.map((metric) => (
                <div className="flex items-center space-x-2" key={metric.value}>
                  <Checkbox 
                    id={`metric-${metric.value}`} 
                    checked={selectedMetrics.includes(metric.value)} 
                    onCheckedChange={() => handleMetricToggle(metric.value)} 
                  />
                  <Label htmlFor={`metric-${metric.value}`}>{metric.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isGenerating}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" disabled={isGenerating}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportBuilderComponent;
