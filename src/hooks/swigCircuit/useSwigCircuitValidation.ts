
import { toast } from '@/hooks/use-toast';

interface ValidationProps {
  name: string;
  startDate: string;
  endDate: string;
  selectedTheme: string;
  selectedEstablishments: any[];
  ticketTiers?: any[];
}

export const useSwigCircuitValidation = (
  props: ValidationProps,
  setCurrentTab: (tab: string) => void
) => {
  const validateForm = (): boolean => {
    if (!props.name) {
      toast({
        title: 'Missing Name',
        description: 'Please enter a name for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("basics");
      return false;
    }

    if (!props.startDate) {
      toast({
        title: 'Missing Date',
        description: 'Please select a start date for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("basics");
      return false;
    }

    if (!props.selectedTheme) {
      toast({
        title: 'Theme Required',
        description: 'Please select a theme for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("theme");
      return false;
    }

    if (props.selectedEstablishments.length < 2) {
      toast({
        title: 'Venues Required',
        description: 'Please select at least 2 establishments for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("venues");
      return false;
    }
    
    if (props.ticketTiers && props.ticketTiers.length === 0) {
      toast({
        title: 'Ticket Tiers Required',
        description: 'Please add at least one ticket tier for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("tickets");
      return false;
    }

    return true;
  };

  return {
    validateForm
  };
};
