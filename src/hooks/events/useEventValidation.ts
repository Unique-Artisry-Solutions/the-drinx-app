
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './useEventCreation';

export const useEventValidation = () => {
  const { toast } = useToast();
  
  const validateBasicDetails = (data: Pick<EventFormData, 'name' | 'date' | 'time'>): boolean => {
    if (!data.name.trim()) {
      toast({
        title: "Event name required",
        description: "Please provide a name for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (!data.date) {
      toast({
        title: "Event date required",
        description: "Please select a date for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (!data.time) {
      toast({
        title: "Event time required",
        description: "Please select a time for your event",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const validateVenue = (venue: EventFormData['venue']): boolean => {
    if (!venue) {
      toast({
        title: "Venue required",
        description: "Please select a venue for your event",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  
  const validateTickets = (tickets: EventFormData['ticketTypes']): boolean => {
    if (tickets.length === 0) {
      toast({
        title: "Ticket information required",
        description: "Please add at least one ticket type",
        variant: "destructive"
      });
      return false;
    }
    
    for (const ticket of tickets) {
      if (!ticket.name.trim()) {
        toast({
          title: "Ticket name required",
          description: "Each ticket type must have a name",
          variant: "destructive"
        });
        return false;
      }
      
      if (ticket.quantity <= 0) {
        toast({
          title: "Invalid ticket quantity",
          description: "Ticket quantity must be greater than zero",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  return {
    validateBasicDetails,
    validateVenue,
    validateTickets
  };
};
