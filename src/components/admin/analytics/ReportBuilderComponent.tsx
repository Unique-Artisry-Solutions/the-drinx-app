
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RealTimeMetrics, AnalyticsTimeFrame, ChartDataPoint } from '@/services/realTimeAnalyticsService';

interface ReportBuilderComponentProps {
  analyticsData?: {
    metrics: RealTimeMetrics;
    timeFrameData: AnalyticsTimeFrame[];
    chartData: ChartDataPoint[];
    eventAnalytics: {
      totalAttendees: number;
      checkedInAttendees: number;
      revenue: number;
      conversionRate: number;
    };
  };
}

const ReportBuilderComponent: React.FC<ReportBuilderComponentProps> = ({
  analyticsData
}) => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [reportTitle, setReportTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'performance', label: 'Performance Summary' },
    { value: 'engagement', label: 'User Engagement Report' },
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'trends', label: 'Trends Analysis' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'ytd', label: 'Year to date' }
  ];

  const generateReport = async () => {
    if (!reportType || !reportTitle.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a report type and enter a title.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = {
        title: reportTitle,
        type: reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        data: analyticsData || {},
        summary: generateReportSummary()
      };

      // In a real implementation, this would generate and download a PDF or Excel file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Report Generated',
        description: 'Your analytics report has been generated and downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Report Generation Failed',
        description: 'There was an error generating the report.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportSummary = () => {
    if (!analyticsData) return 'No data available for analysis.';

    const { metrics, timeFrameData, eventAnalytics } = analyticsData;
    
    const summaryPoints = [
      `Active users: ${metrics.activeUsers}`,
      `Total page views: ${metrics.pageViews}`,
      `Conversions: ${metrics.conversions}`,
      `Revenue: $${metrics.revenue.toLocaleString()}`,
      `Event attendees: ${eventAnalytics.totalAttendees}`,
      `Check-in rate: ${eventAnalytics.totalAttendees > 0 ? ((eventAnalytics.checkedInAttendees / eventAnalytics.totalAttendees) * 100).toFixed(1) : 0}%`,
      `Conversion rate: ${eventAnalytics.conversionRate.toFixed(1)}%`
    ];

    return summaryPoints.join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Create custom analytics reports with real-time data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reportTitle">Report Title</Label>
              <Input
                id="reportTitle"
                placeholder="Enter report title..."
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {analyticsData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Preview of data that will be included in your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Real-time Metrics</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Active users, page views, conversions, and revenue data
                </p>
                <div className="text-xs text-blue-600 mt-2">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Trend Analysis</h4>
                <p className="text-sm text-green-700 mt-1">
                  {analyticsData.timeFrameData.length} trend metrics with comparative analysis
                </p>
                <div className="text-xs text-green-600 mt-2">
                  7-day comparison period
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Event Analytics</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Attendee data, check-ins, and conversion metrics
                </p>
                <div className="text-xs text-purple-600 mt-2">
                  {analyticsData.eventAnalytics.totalAttendees} total attendees
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Report Summary</h4>
              <p className="text-sm text-gray-600">
                {generateReportSummary()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportBuilderComponent;
