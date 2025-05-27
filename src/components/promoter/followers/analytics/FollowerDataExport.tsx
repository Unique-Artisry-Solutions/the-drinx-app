
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Calendar, Users, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
  includeFields: {
    basicInfo: boolean;
    demographics: boolean;
    engagement: boolean;
    preferences: boolean;
    analytics: boolean;
  };
  segmentFilter?: string;
}

interface FollowerDataExportProps {
  promoterId: string;
  totalFollowers: number;
  onExport: (options: ExportOptions) => Promise<void>;
}

const FollowerDataExport: React.FC<FollowerDataExportProps> = ({
  promoterId,
  totalFollowers,
  onExport
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: '30d',
    includeFields: {
      basicInfo: true,
      demographics: true,
      engagement: true,
      preferences: false,
      analytics: false
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportOptions);
      toast({
        title: 'Export Started',
        description: `Your follower data export (${exportOptions.format.toUpperCase()}) is being prepared. You'll receive a download link shortly.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your follower data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateField = (field: keyof ExportOptions['includeFields'], value: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      includeFields: {
        ...prev.includeFields,
        [field]: value
      }
    }));
  };

  const estimatedRecords = Math.min(totalFollowers, exportOptions.dateRange === 'all' ? totalFollowers : 
    exportOptions.dateRange === '1y' ? Math.floor(totalFollowers * 0.8) :
    exportOptions.dateRange === '90d' ? Math.floor(totalFollowers * 0.6) :
    exportOptions.dateRange === '30d' ? Math.floor(totalFollowers * 0.4) :
    Math.floor(totalFollowers * 0.2)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Follower Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf') => 
              setExportOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV - Spreadsheet compatible
                </div>
              </SelectItem>
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Excel (XLSX)
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON - Developer friendly
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select 
            value={exportOptions.dateRange} 
            onValueChange={(value: '7d' | '30d' | '90d' | '1y' | 'all') => 
              setExportOptions(prev => ({ ...prev, dateRange: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Include Fields */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Include Data Fields</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="basicInfo"
                checked={exportOptions.includeFields.basicInfo}
                onCheckedChange={(checked) => updateField('basicInfo', !!checked)}
              />
              <label htmlFor="basicInfo" className="text-sm">
                Basic Information (Name, Email, Join Date)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="demographics"
                checked={exportOptions.includeFields.demographics}
                onCheckedChange={(checked) => updateField('demographics', !!checked)}
              />
              <label htmlFor="demographics" className="text-sm">
                Demographics (Age, Location, Gender)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="engagement"
                checked={exportOptions.includeFields.engagement}
                onCheckedChange={(checked) => updateField('engagement', !!checked)}
              />
              <label htmlFor="engagement" className="text-sm">
                Engagement Metrics (Opens, Clicks, Interactions)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preferences"
                checked={exportOptions.includeFields.preferences}
                onCheckedChange={(checked) => updateField('preferences', !!checked)}
              />
              <label htmlFor="preferences" className="text-sm">
                Notification Preferences
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analytics"
                checked={exportOptions.includeFields.analytics}
                onCheckedChange={(checked) => updateField('analytics', !!checked)}
              />
              <label htmlFor="analytics" className="text-sm">
                Advanced Analytics (Detailed activity history)
              </label>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Estimated records:</span>
            <span className="font-medium">{estimatedRecords.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Export date:</span>
            <span className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>File format:</span>
            <span className="font-medium uppercase">{exportOptions.format}</span>
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={isExporting || estimatedRecords === 0}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export {estimatedRecords.toLocaleString()} Records
            </>
          )}
        </Button>

        {/* Privacy Notice */}
        <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded border">
          <strong>Privacy Notice:</strong> Exported data will include personal information of your followers. 
          Please ensure you comply with applicable privacy laws and only use this data for legitimate business purposes.
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerDataExport;
