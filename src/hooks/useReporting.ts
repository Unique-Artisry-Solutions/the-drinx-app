
import { useState, useCallback } from 'react';
import {
  generateEventReport,
  generateComparativeAnalysis,
  getCustomDashboards,
  exportData,
  type EventReport,
  type ComparativeAnalysis,
  type CustomDashboard,
  type ExportOptions
} from '@/services/reportingService';

interface UseReportingReturn {
  // Event Reports
  eventReports: EventReport[];
  generateReport: (eventId: string, reportType: EventReport['reportType']) => Promise<void>;
  
  // Comparative Analysis
  comparativeAnalysis: ComparativeAnalysis | null;
  generateComparison: (eventIds: string[]) => Promise<void>;
  
  // Custom Dashboards
  customDashboards: CustomDashboard[];
  loadDashboards: (promoterId: string) => Promise<void>;
  
  // Data Export
  exportReport: (options: ExportOptions) => Promise<{ url: string; filename: string }>;
  
  // Loading states
  isGeneratingReport: boolean;
  isGeneratingComparison: boolean;
  isLoadingDashboards: boolean;
  isExporting: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useReporting(): UseReportingReturn {
  const [eventReports, setEventReports] = useState<EventReport[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<ComparativeAnalysis | null>(null);
  const [customDashboards, setCustomDashboards] = useState<CustomDashboard[]>([]);
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (eventId: string, reportType: EventReport['reportType']) => {
    setIsGeneratingReport(true);
    setError(null);
    
    try {
      const report = await generateEventReport(eventId, reportType);
      setEventReports(prev => {
        // Replace existing report for same event or add new one
        const filtered = prev.filter(r => r.eventId !== eventId || r.reportType !== reportType);
        return [report, ...filtered];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  }, []);

  const generateComparison = useCallback(async (eventIds: string[]) => {
    if (eventIds.length < 2) {
      setError('Please select at least 2 events for comparison');
      return;
    }
    
    setIsGeneratingComparison(true);
    setError(null);
    
    try {
      const analysis = await generateComparativeAnalysis(eventIds);
      setComparativeAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate comparison');
    } finally {
      setIsGeneratingComparison(false);
    }
  }, []);

  const loadDashboards = useCallback(async (promoterId: string) => {
    setIsLoadingDashboards(true);
    setError(null);
    
    try {
      const dashboards = await getCustomDashboards(promoterId);
      setCustomDashboards(dashboards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboards');
    } finally {
      setIsLoadingDashboards(false);
    }
  }, []);

  const exportReport = useCallback(async (options: ExportOptions) => {
    setIsExporting(true);
    setError(null);
    
    try {
      const result = await exportData(options);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}
