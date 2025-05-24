
import { useState, useEffect } from 'react';
import { FeatureItem } from '../types';
import { 
  adminFeatures as defaultAdminFeatures 
} from '../features/adminFeatures';
import { 
  establishmentFeatures as defaultEstablishmentFeatures 
} from '../features/establishmentFeatures';
import { 
  individualFeatures as defaultIndividualFeatures 
} from '../features/individualFeatures';
import { 
  promoterFeatures as defaultPromoterFeatures 
} from '../features/promoterFeatures';

export const useFeatureStatus = () => {
  const [adminFeatures, setAdminFeatures] = useState<FeatureItem[]>(defaultAdminFeatures);
  const [establishmentFeatures, setEstablishmentFeatures] = useState<FeatureItem[]>(defaultEstablishmentFeatures);
  const [individualFeatures, setIndividualFeatures] = useState<FeatureItem[]>(defaultIndividualFeatures);
  const [promoterFeatures, setPromoterFeatures] = useState<FeatureItem[]>(defaultPromoterFeatures);
  const [updatedFeaturesCount, setUpdatedFeaturesCount] = useState(0);

  // Calculate updated features count whenever features change
  useEffect(() => {
    const count = [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures
    ].filter(f => f.statusUpdated).length;
    
    setUpdatedFeaturesCount(count);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

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
