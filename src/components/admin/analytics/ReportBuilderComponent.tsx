
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ReportConfig {
  name: string;
  timeFrame: string;
  metrics: string[];
  format: 'table' | 'chart' | 'export';
  filters: Record<string, any>;
}

const ReportBuilderComponent: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    timeFrame: 'last_30_days',
    metrics: [],
    format: 'table',
    filters: {}
  });

  const availableMetrics = [
    { id: 'user_engagement', label: 'User Engagement' },
    { id: 'revenue_metrics', label: 'Revenue Metrics' },
    { id: 'event_performance', label: 'Event Performance' },
    { id: 'audience_growth', label: 'Audience Growth' }
  ];

  const handleMetricToggle = (metricId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: checked 
        ? [...prev.metrics, metricId]
        : prev.metrics.filter(m => m !== metricId)
    }));
  };

  const handleFormatChange = (format: 'table' | 'chart' | 'export') => {
    setReportConfig(prev => ({
      ...prev,
      format
    }));
  };

  const handleGenerateReport = () => {
    console.log('Generating report with config:', reportConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reportName">Report Name</Label>
          <Input
            id="reportName"
            value={reportConfig.name}
            onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter report name"
          />
        </div>

        <div className="space-y-2">
          <Label>Time Frame</Label>
          <Select 
            value={reportConfig.timeFrame} 
            onValueChange={(value) => setReportConfig(prev => ({ ...prev, timeFrame: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Metrics to Include</Label>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.id}
                  checked={reportConfig.metrics.includes(metric.id)}
                  onCheckedChange={(checked) => handleMetricToggle(metric.id, !!checked)}
                />
                <Label htmlFor={metric.id}>{metric.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select 
            value={reportConfig.format} 
            onValueChange={handleFormatChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table View</SelectItem>
              <SelectItem value="chart">Chart View</SelectItem>
              <SelectItem value="export">Export (CSV/PDF)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleGenerateReport} className="w-full">
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportBuilderComponent;
