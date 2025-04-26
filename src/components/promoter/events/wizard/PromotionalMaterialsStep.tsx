
import React from 'react';
import { useEventWizard } from './EventWizardContext';
import MediaStep from './MediaStep';

const PromotionalMaterialsStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();
  
  // This component simply delegates to MediaStep
  // MediaStep already handles promotional material uploads
  return <MediaStep />;
};

export default PromotionalMaterialsStep;
