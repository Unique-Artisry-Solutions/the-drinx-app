
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Helper to convert object to CSV format
function convertToCSV(data: any): string {
  if (!data || typeof data !== 'object') {
    return '';
  }

  // If it's an array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          
          // Handle different types of values
          if (value === null || value === undefined) return '';
          
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          
          // Escape strings with quotes and commas
          if (typeof value === 'string') {
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
          }
          
          return value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
  
  // If it's a simple object
  const entries = Object.entries(data);
  const csvRows = entries.map(([key, value]) => {
    // Handle different types of values
    let formattedValue = value;
    
    if (value === null || value === undefined) {
      formattedValue = '';
    } else if (typeof value === 'object') {
      formattedValue = `"${JSON.stringify(value).replace(/"/g, '""')}"`;
    } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      formattedValue = `"${value.replace(/"/g, '""')}"`;
    }
    
    return `${key},${formattedValue}`;
  });
  
  return csvRows.join('\n');
}

export function useAnalyticsExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportAnalytics = async (data: any, fileName: string = 'analytics_export'): Promise<boolean> => {
    setIsExporting(true);
    
    try {
      // Format the data based on its structure
      let csvData: string;
      
      // Convert data to CSV format
      csvData = convertToCSV(data);
      
      if (!csvData) {
        throw new Error('No data to export');
      }
      
      // Create a Blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: `Analytics data has been exported as ${fileName}_${timestamp}.csv`,
      });
      
      return true;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the analytics data.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportAnalytics,
    isExporting
  };
}
