
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, FileText, Table } from 'lucide-react';
import { exportToCSV, exportToJSON, getExportFilename } from './exportUtils';

interface ReportExportUtilityProps {
  data: any[];
  reportType: string;
  onExportComplete?: (result: any) => void;
}

export function ReportExportUtility({ 
  data, 
  reportType, 
  onExportComplete 
}: ReportExportUtilityProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Available fields based on data structure
  const availableFields = data.length > 0 ? Object.keys(data[0]) : [];

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = async () => {
    if (data.length === 0) return;

    setIsExporting(true);
    
    try {
      const fieldsToExport = selectedFields.length > 0 ? selectedFields : availableFields;
      const filteredData = data.map(item => {
        const filtered: any = {};
        fieldsToExport.forEach(field => {
          if (item[field] !== undefined) {
            filtered[field] = item[field];
          }
        });
        return filtered;
      });

      const filename = getExportFilename(reportType, exportFormat);

      switch (exportFormat) {
        case 'csv':
          exportToCSV(filteredData, filename);
          break;
        case 'json':
          exportToJSON(filteredData, filename);
          break;
        default:
          console.warn('Unsupported export format:', exportFormat);
      }

      onExportComplete?.({
        format: exportFormat,
        recordCount: filteredData.length,
        filename
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields);
  };

  const clearSelection = () => {
    setSelectedFields([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fields to Export ({selectedFields.length} selected)</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllFields}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2">
            {availableFields.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={() => handleFieldToggle(field)}
                />
                <Label htmlFor={field} className="text-sm">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Records:</span>
              <span className="font-medium">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-medium uppercase">{exportFormat}</span>
            </div>
            <div className="flex justify-between">
              <span>Fields:</span>
              <span className="font-medium">
                {selectedFields.length || availableFields.length}
              </span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={data.length === 0 || isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </CardContent>
    </Card>
  );
}
