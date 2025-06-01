import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface ReportConfig {
  name: string;
  timeFrame: string;
  metrics: string[];
  filters: Record<string, any>;
  format: 'table' | 'chart' | 'export';
}

const ReportBuilderComponent: React.FC = () => {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    timeFrame: 'last_30_days',
    metrics: [],
    filters: {},
    format: 'table'
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Sample data structure for metrics
  const availableMetrics = [
    { id: 'user_engagement', name: 'User Engagement', description: 'Active users, session duration' },
    { id: 'revenue', name: 'Revenue', description: 'Ticket sales, subscription revenue' },
    { id: 'events', name: 'Events', description: 'Event attendance, creation rates' }
  ];

  const timeFrameOptions = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report with config:', config);
    // Implementation for report generation
  };

  const handleMetricToggle = (metricId: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={config.name}
              onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label>Time Frame</Label>
            <Select value={config.timeFrame} onValueChange={value => setConfig(prev => ({ ...prev, timeFrame: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time frame" />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Metrics</Label>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.map(metric => (
                <Button
                  key={metric.id}
                  variant={config.metrics.includes(metric.id) ? 'default' : 'outline'}
                  onClick={() => handleMetricToggle(metric.id)}
                >
                  {metric.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Filters</Label>
            {/* Add filter inputs based on selected metrics */}
          </div>

          <div>
            <Label>Format</Label>
            <Select value={config.format} onValueChange={value => setConfig(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="chart">Chart</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleGenerateReport}>Generate Report</Button>
    </div>
  );
};

export default ReportBuilderComponent;
