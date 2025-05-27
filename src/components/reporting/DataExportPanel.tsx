
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Calendar, CheckCircle } from 'lucide-react';
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';
import type { ExportOptions } from '@/services/reportingService';

interface DataExportPanelProps {
  onExport: (options: ExportOptions) => Promise<{ url: string; filename: string }>;
  isExporting: boolean;
}

const DataExportPanel: React.FC<DataExportPanelProps> = ({
  onExport,
  isExporting
}) => {
  const { exportAnalytics, isExporting: isAnalyticsExporting } = useAnalyticsExport();
  const [exportFormat, setExportFormat] = useState<ExportOptions['format']>('csv');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [includeCharts, setIncludeCharts] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['events', 'tickets']);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<{ filename: string; url: string } | null>(null);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Comma Separated)', description: 'Best for spreadsheet analysis' },
    { value: 'xlsx', label: 'Excel Workbook', description: 'Formatted spreadsheet with multiple sheets' },
    { value: 'pdf', label: 'PDF Report', description: 'Professional formatted document' },
    { value: 'json', label: 'JSON Data', description: 'Raw data for developers' }
  ];

  const dataTypes = [
    { id: 'events', label: 'Event Details', description: 'Basic event information and settings' },
    { id: 'tickets', label: 'Ticket Sales', description: 'All ticket purchases and transactions' },
    { id: 'attendees', label: 'Attendee Data', description: 'Participant information and check-ins' },
    { id: 'marketing', label: 'Marketing Campaigns', description: 'Campaign performance and analytics' },
    { id: 'revenue', label: 'Revenue & Finances', description: 'Financial data and revenue streams' },
    { id: 'analytics', label: 'Analytics Data', description: 'User behavior and event analytics' }
  ];

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setSelectedDataTypes(prev => [...prev, dataType]);
    } else {
      setSelectedDataTypes(prev => prev.filter(type => type !== dataType));
    }
  };

  const handleExport = async () => {
    if (!startDate || !endDate) return;

    setExportProgress(0);
    
    const options: ExportOptions = {
      format: exportFormat,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      includeCharts,
      customFields: selectedDataTypes
    };

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await onExport(options);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      setLastExport(result);
      
      // Reset progress after a delay
      setTimeout(() => setExportProgress(0), 3000);
    } catch (error) {
      setExportProgress(0);
    }
  };

  const handleQuickExport = async (dataType: string) => {
    const mockData = {
      events: [
        { name: 'Summer Festival', date: '2024-07-15', tickets_sold: 450, revenue: 22500 },
        { name: 'Tech Conference', date: '2024-06-22', tickets_sold: 200, revenue: 15000 }
      ],
      tickets: [
        { event: 'Summer Festival', type: 'General', quantity: 300, price: 50 },
        { event: 'Summer Festival', type: 'VIP', quantity: 150, price: 100 }
      ]
    };

    await exportAnalytics(mockData[dataType as keyof typeof mockData], `${dataType}_export`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Export
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Export common data types with one click
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => handleQuickExport('events')}
              disabled={isAnalyticsExporting}
            >
              <FileText className="h-5 w-5 mb-2" />
              <div className="font-medium">Event Data</div>
              <div className="text-xs text-muted-foreground">Export all event information</div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => handleQuickExport('tickets')}
              disabled={isAnalyticsExporting}
            >
              <FileText className="h-5 w-5 mb-2" />
              <div className="font-medium">Ticket Sales</div>
              <div className="text-xs text-muted-foreground">Export ticket sales data</div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start"
              disabled={isAnalyticsExporting}
            >
              <FileText className="h-5 w-5 mb-2" />
              <div className="font-medium">Analytics Report</div>
              <div className="text-xs text-muted-foreground">Export comprehensive analytics</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Export */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Data Export</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure a custom export with specific date ranges and data types
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-3 block">Export Date Range</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="text-sm font-medium mb-3 block">Export Format</label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportOptions['format'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Types */}
          <div>
            <label className="text-sm font-medium mb-3 block">Data to Include</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataTypes.map(dataType => (
                <div key={dataType.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedDataTypes.includes(dataType.id)}
                    onCheckedChange={(checked) => handleDataTypeChange(dataType.id, !!checked)}
                  />
                  <div className="flex-1">
                    <label htmlFor={dataType.id} className="text-sm font-medium cursor-pointer">
                      {dataType.label}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {dataType.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="text-sm font-medium mb-3 block">Additional Options</label>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="include-charts"
                checked={includeCharts}
                onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                disabled={exportFormat === 'csv' || exportFormat === 'json'}
              />
              <label htmlFor="include-charts" className="text-sm cursor-pointer">
                Include charts and visualizations (PDF/Excel only)
              </label>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && exportProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          {/* Last Export Result */}
          {lastExport && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Export Complete</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your data has been exported as {lastExport.filename}
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <a href={lastExport.url} download={lastExport.filename}>
                  Download File
                </a>
              </Button>
            </div>
          )}

          {/* Export Button */}
          <Button 
            onClick={handleExport}
            disabled={!startDate || !endDate || selectedDataTypes.length === 0 || isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportPanel;
