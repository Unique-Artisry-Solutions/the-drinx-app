import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportData {
  date: string;
  value: number;
  secondary: number;
}

interface FilterOption {
  label: string;
  value: string;
}

const ReportBuilderComponent = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('last_30_days');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [reportName, setReportName] = useState<string>('');

  const availableMetrics = [
    { label: 'Page Views', value: 'page_views' },
    { label: 'Unique Visitors', value: 'unique_visitors' },
    { label: 'Conversion Rate', value: 'conversion_rate' },
    { label: 'Average Session Duration', value: 'avg_session_duration' }
  ];

  const timeFrames = [
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Last 90 Days', value: 'last_90_days' },
    { label: 'Custom Range', value: 'custom_range' }
  ];

  const filters: Record<string, FilterOption[]> = {
    device: [
      { label: 'Mobile', value: 'mobile' },
      { label: 'Desktop', value: 'desktop' },
      { label: 'Tablet', value: 'tablet' }
    ],
    location: [
      { label: 'United States', value: 'usa' },
      { label: 'Canada', value: 'canada' },
      { label: 'United Kingdom', value: 'uk' }
    ]
  };

  const generateMockData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      secondary: Math.floor(Math.random() * 500)
    }));
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handleGenerateReport = () => {
    console.log('Generating report with:', {
      metrics: selectedMetrics,
      timeFrame: selectedTimeFrame,
      filters: selectedFilters,
      name: reportName
    });
  };

  const mockData = generateMockData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Customize your report by selecting metrics, time frame, and filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Report Name</Label>
            <Input
              type="text"
              placeholder="Enter report name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          <div>
            <Label>Metrics</Label>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.map(metric => (
                <Badge
                  key={metric.value}
                  variant={selectedMetrics.includes(metric.value) ? 'default' : 'outline'}
                  onClick={() => handleMetricToggle(metric.value)}
                  className="cursor-pointer"
                >
                  {metric.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Time Frame</Label>
            <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
              <SelectTrigger>
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                {timeFrames.map(frame => (
                  <SelectItem key={frame.value} value={frame.value}>
                    {frame.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Filters</Label>
            {Object.entries(filters).map(([filterName, options]) => (
              <div key={filterName} className="space-y-2">
                <p className="text-sm font-medium">{filterName}</p>
                <Select
                  value={selectedFilters[filterName] || ''}
                  onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, [filterName]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${filterName}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </CardContent>
      </Card>
      
      {selectedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Preview of your custom report</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportBuilderComponent;
