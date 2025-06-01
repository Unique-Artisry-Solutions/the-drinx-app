
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportType, exportToCSV, exportToJSON } from './exportUtils';

export interface ReportExportUtilityProps {
  data: any[];
  reportType: ReportType;
}

export function ReportExportUtility({ data, reportType }: ReportExportUtilityProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;
      
      switch (exportFormat) {
        case 'csv':
          exportToCSV(data, `${filename}.csv`);
          break;
        case 'json':
          exportToJSON(data, `${filename}.json`);
          break;
        case 'pdf':
          // PDF export would be implemented here
          console.log('PDF export not yet implemented');
          break;
      }
      
      toast({
        title: 'Export Successful',
        description: `${reportType} report exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the report',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Export Utility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select value={exportFormat} onValueChange={(value: 'csv' | 'json' | 'pdf') => setExportFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Exporting {data.length} records of type: {reportType}
        </div>

        <Button onClick={handleExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </CardContent>
    </Card>
  );
}
