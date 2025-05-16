
import { useState } from 'react';
import { FeatureItem } from '../types';
import { generateCSV, generateJSON, generateMarkdownReport } from '../utils/exportUtils';

export const useExportFunctions = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportCSV = (features: FeatureItem[], filename = 'features-export.csv') => {
    setIsExporting(true);
    
    try {
      const csv = generateCSV(features);
      
      // Create a blob and download it
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { success: false, error };
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportJSON = (features: FeatureItem[], filename = 'features-export.json') => {
    setIsExporting(true);
    
    try {
      const json = generateJSON(features);
      
      // Create a blob and download it
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting JSON:', error);
      return { success: false, error };
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportMarkdown = (features: FeatureItem[], filename = 'features-report.md') => {
    setIsExporting(true);
    
    try {
      const markdown = generateMarkdownReport(features);
      
      // Create a blob and download it
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting Markdown:', error);
      return { success: false, error };
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    isExporting,
    exportCSV,
    exportJSON,
    exportMarkdown
  };
};
