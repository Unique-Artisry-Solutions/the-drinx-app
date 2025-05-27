
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, BarChart3, Download, Plus, AlertCircle } from 'lucide-react';
import { useReporting } from '@/hooks/useReporting';
import { EventReportsPanel } from '@/components/reporting/EventReportsPanel';
import { ComparativeAnalyticsPanel } from '@/components/reporting/ComparativeAnalyticsPanel';
import { CustomDashboardPanel } from '@/components/reporting/CustomDashboardPanel';
import { DataExportPanel } from '@/components/reporting/DataExportPanel';

interface DashboardReportingTabProps {
  promoterId: string;
}

const DashboardReportingTab: React.FC<DashboardReportingTabProps> = ({
  promoterId
}) => {
  const {
    eventReports,
    generateReport,
    comparativeAnalysis,
    generateComparison,
    customDashboards,
    loadDashboards,
    exportReport,
    isGeneratingReport,
    isGeneratingComparison,
    isLoadingDashboards,
    isExporting,
    error,
    clearError
  } = useReporting();

  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    loadDashboards(promoterId);
  }, [promoterId, loadDashboards]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reporting Suite</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze your event performance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => generateReport('sample-event-1', 'comprehensive')}
            disabled={isGeneratingReport}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setActiveTab('export')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Reporting Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-2 w-full">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Event Reports
          </TabsTrigger>
          <TabsTrigger value="comparative" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparative Analytics
          </TabsTrigger>
          <TabsTrigger value="dashboards" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Custom Dashboards
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <EventReportsPanel
            reports={eventReports}
            onGenerateReport={generateReport}
            isGenerating={isGeneratingReport}
          />
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <ComparativeAnalyticsPanel
            analysis={comparativeAnalysis}
            onGenerateComparison={generateComparison}
            isGenerating={isGeneratingComparison}
          />
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-6">
          <CustomDashboardPanel
            dashboards={customDashboards}
            promoterId={promoterId}
            isLoading={isLoadingDashboards}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <DataExportPanel
            onExport={exportReport}
            isExporting={isExporting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardReportingTab;
