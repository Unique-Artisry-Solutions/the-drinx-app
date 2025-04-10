import {
  FeatureItem
} from '../types';

/**
 * Hook for CSV export functionality
 */
export const useExportFunctions = () => {
  const handleExportCSV = (adminFeatures: FeatureItem[], establishmentFeatures: FeatureItem[], individualFeatures: FeatureItem[]) => {
    // Import the generateCSV function dynamically to keep the bundle size small
    import('../utils').then(({ generateCSV }) => {
      generateCSV(adminFeatures, establishmentFeatures, individualFeatures);
    });
  };

  return { handleExportCSV };
};
