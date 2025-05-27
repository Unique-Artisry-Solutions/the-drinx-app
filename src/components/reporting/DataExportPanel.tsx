
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Database, Calendar } from 'lucide-react';
import type { ExportOptions } from '@/services/reportingService';

interface DataExportPanelProps {
  onExport: (options: ExportOptions) => Promise<{ url: string; filename: string }>;
  isExporting: boolean;
}

const DataExportPanel: React.FC<DataExportPanelProps> = ({
  onExport,
  isExporting
}) => {
  const [exportType, setExportType] = useState<'csv' | 'pdf' | 'xlsx' | 'json'>('csv');
  const [dataType, setDataType] = useState<'events' | 'attendees' | 'revenue' | 'all'>('events');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const handleExport = async () => {
    try {
      const result = await onExport({
        format: exportType,
        dataType,
        dateRange,
        includeMetrics: true
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Data Export</h3>
        <p className="text-sm text-muted-foreground">
          Export your event data in various formats for external analysis
        </p>
      </div>

      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Type</label>
              <Select value={dataType} onValueChange={(value: any) => setDataType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="events">Events Data</SelectItem>
                  <SelectItem value="attendees">Attendees Data</SelectItem>
                  <SelectItem value="revenue">Revenue Data</SelectItem>
                  <SelectItem value="all">All Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                filename: 'events_data_2024-05-26.csv',
                type: 'Events Data',
                format: 'CSV',
                date: '2024-05-26',
                size: '2.3 MB'
              },
              {
                filename: 'revenue_report_2024-05-25.pdf',
                type: 'Revenue Report',
                format: 'PDF',
                date: '2024-05-25',
                size: '1.8 MB'
              }
            ].map((export_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{export_.filename}</div>
                    <div className="text-sm text-muted-foreground">
                      {export_.type} • {export_.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{export_.format}</Badge>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {export_.date}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportPanel;
