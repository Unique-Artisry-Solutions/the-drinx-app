
import { useState } from 'react';
import { FeatureItem } from '../types';
import { 
  adminFeatures as initialAdminFeatures, 
  establishmentFeatures as initialEstablishmentFeatures, 
  individualFeatures as initialIndividualFeatures,
  promoterFeatures as initialPromoterFeatures 
} from '../features';

/**
 * Hook to manage feature data state
 */
export const useFeatureStatus = () => {
  const [adminFeatures, setAdminFeatures] = useState<FeatureItem[]>(initialAdminFeatures);
  const [establishmentFeatures, setEstablishmentFeatures] = useState<FeatureItem[]>(initialEstablishmentFeatures);
  const [individualFeatures, setIndividualFeatures] = useState<FeatureItem[]>(initialIndividualFeatures);
  const [promoterFeatures, setPromoterFeatures] = useState<FeatureItem[]>(initialPromoterFeatures);

  // Count features with updated status
  const updatedFeaturesCount = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ].filter(feature => feature.statusUpdated).length;

  return {
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    setAdminFeatures,
    setEstablishmentFeatures,
    setIndividualFeatures,
    setPromoterFeatures,
    updatedFeaturesCount
  };
};

