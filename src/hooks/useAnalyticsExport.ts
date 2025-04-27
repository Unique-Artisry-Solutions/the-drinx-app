
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAnalyticsExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportAnalytics = async (data: any, filename: string) => {
    setIsExporting(true);
    try {
      // Convert data to CSV format
      const csvContent = Object.entries(data).map(([key, value]) => 
        `${key},${value}`
      ).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your analytics data has been downloaded.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportAnalytics
  };
};
