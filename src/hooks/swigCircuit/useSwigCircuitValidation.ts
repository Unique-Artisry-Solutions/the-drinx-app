
import { useToast } from '@/hooks/use-toast';
import { SwigCircuitFormState } from './types';

export const useSwigCircuitValidation = (formState: Pick<SwigCircuitFormState, 'name' | 'startDate' | 'endDate' | 'selectedTheme' | 'selectedEstablishments'>, setCurrentTab: (tab: string) => void) => {
  const { toast } = useToast();

  const validateForm = (): boolean => {
    if (!formState.name || !formState.startDate || !formState.endDate) {
      toast({
        title: 'Missing basic information',
        description: 'Please fill out all required fields in the Basics tab',
        variant: 'destructive',
      });
      setCurrentTab("basics");
      return false;
    }
    
    if (!formState.selectedTheme) {
      toast({
        title: 'Missing theme',
        description: 'Please select a theme for your Swig Circuit',
        variant: 'destructive',
      });
      setCurrentTab("theme");
      return false;
    }

    if (formState.selectedEstablishments.length < 2) {
      toast({
        title: 'Not enough establishments',
        description: 'Please select at least 2 establishments for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("venues");
      return false;
    }

    return true;
  };

  return { validateForm };
};
