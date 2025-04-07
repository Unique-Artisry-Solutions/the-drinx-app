
import { useSwigCircuitFormState } from './useSwigCircuitFormState';
import { useSwigCircuitValidation } from './useSwigCircuitValidation';
import { useSwigCircuitSubmission } from './useSwigCircuitSubmission';
import { UseSwigCircuitCreationReturn } from './types';

export const useSwigCircuitCreation = (): UseSwigCircuitCreationReturn => {
  // Get form state
  const formState = useSwigCircuitFormState();
  
  // Get validation logic
  const { validateForm } = useSwigCircuitValidation({
    name: formState.name,
    startDate: formState.startDate,
    endDate: formState.endDate,
    selectedTheme: formState.selectedTheme,
    selectedEstablishments: formState.selectedEstablishments
  }, formState.setCurrentTab);
  
  // Get submission logic
  const { handleSubmit: submitForm, isSubmitting } = useSwigCircuitSubmission({
    name: formState.name,
    startDate: formState.startDate,
    endDate: formState.endDate,
    description: formState.description,
    imageFile: formState.imageFile,
    previewUrl: formState.previewUrl,
    currentTab: formState.currentTab,
    selectedTheme: formState.selectedTheme,
    maxDistance: formState.maxDistance,
    drinkHighlights: formState.drinkHighlights,
    pairings: formState.pairings,
    selectedEstablishments: formState.selectedEstablishments
  });

  // Create wrapper for submit that validates first
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await submitForm(e);
    }
  };

  return {
    // Pass through all state and setters from formState
    ...formState,
    
    // Override isSubmitting from submission hook
    isSubmitting,
    
    // Add our validated submit handler
    handleSubmit
  };
};

export default useSwigCircuitCreation;
