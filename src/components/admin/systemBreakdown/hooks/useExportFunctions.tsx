
import { FeatureItem } from '../types';
import { generateCSV } from '../utils/exportUtils';

/**
 * Hook for CSV export functionality
 */
export const useExportFunctions = () => {
  const handleExportCSV = (
    adminFeatures: FeatureItem[] = [], 
    establishmentFeatures: FeatureItem[] = [], 
    individualFeatures: FeatureItem[] = [],
    promoterFeatures: FeatureItem[] = []
  ) => {
    // Directly use the function without dynamic import
    generateCSV(adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures);
  };

  return { handleExportCSV };
};
