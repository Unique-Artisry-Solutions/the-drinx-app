
import { useState } from 'react';
import { FeatureItem } from '../types';
import { adminFeatures as initialAdminFeatures, establishmentFeatures as initialEstablishmentFeatures, individualFeatures as initialIndividualFeatures } from '../features';

/**
 * Hook to manage feature data state
 */
export const useFeatureStatus = () => {
  const [adminFeatures, setAdminFeatures] = useState<FeatureItem[]>(initialAdminFeatures);
  const [establishmentFeatures, setEstablishmentFeatures] = useState<FeatureItem[]>(initialEstablishmentFeatures);
  const [individualFeatures, setIndividualFeatures] = useState<FeatureItem[]>(initialIndividualFeatures);

  // Count features with updated status
  const updatedFeaturesCount = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures
  ].filter(feature => feature.statusUpdated).length;

  return {
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    updatedFeaturesCount
  };
};
