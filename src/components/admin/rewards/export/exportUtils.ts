
import { format } from 'date-fns';

export interface RecentExport {
  id: string;
  type: string;
  date: string;
  fileName: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type ReportType = 'users' | 'transactions' | 'analytics' | 'campaigns';

export const reportTypes = [
  { value: 'users' as ReportType, label: 'Users Report' },
  { value: 'transactions' as ReportType, label: 'Transactions Report' },
  { value: 'analytics' as ReportType, label: 'Analytics Report' },
  { value: 'campaigns' as ReportType, label: 'Campaigns Report' }
];

export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data: any[], filename: string = 'export.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportToPDF = async (data: any[], filename: string = 'export.pdf') => {
  // PDF export would be implemented here with a library like jsPDF
  console.log('PDF export not implemented yet', { data, filename });
};

export const formatExportData = (rawData: any[], exportConfig: any) => {
  return rawData.map(item => {
    const formatted: any = {};
    
    // Apply field mappings and formatting
    if (exportConfig.fields) {
      exportConfig.fields.forEach((field: any) => {
        if (item[field.key] !== undefined) {
          formatted[field.label || field.key] = formatFieldValue(item[field.key], field.type);
        }
      });
    } else {
      // Use all fields if no specific configuration
      Object.keys(item).forEach(key => {
        formatted[key] = formatFieldValue(item[key]);
      });
    }
    
    return formatted;
  });
};

const formatFieldValue = (value: any, type?: string) => {
  if (value === null || value === undefined) return '';
  
  switch (type) {
    case 'date':
      return format(new Date(value), 'yyyy-MM-dd');
    case 'datetime':
      return format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
    case 'currency':
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value);
    case 'percentage':
      return `${(value * 100).toFixed(2)}%`;
    default:
      return value.toString();
  }
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const getExportFilename = (baseFilename: string, format: string) => {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
  const extension = format.toLowerCase();
  return `${baseFilename}_${timestamp}.${extension}`;
};
