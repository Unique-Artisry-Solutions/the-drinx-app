import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface ReportBuilderProps {
  onGenerateReport: (config: any) => void;
  isGenerating?: boolean;
}

export function ReportBuilderComponent({ onGenerateReport, isGenerating }: ReportBuilderProps) {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Available metrics - preserved as placeholder
  const availableMetrics = [
    { id: 'users', label: 'User Activity' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'conversions', label: 'Conversions' }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleGenerate = () => {
    const config = {
      name: reportName,
      type: reportType,
      dateRange,
      metrics: selectedMetrics
    };
    onGenerateReport(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-name">Report Name</Label>
          <Input
            id="report-name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name"
          />
        </div>

        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="detailed">Detailed Report</SelectItem>
              <SelectItem value="comparison">Comparison Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Metrics to Include</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => handleMetricToggle(metric.id)}
                />
                <Label htmlFor={metric.id}>{metric.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="text-sm text-muted-foreground">
            {dateRange?.from && dateRange?.to
              ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`
              : 'Select date range'
            }
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!reportName || !reportType || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
}
