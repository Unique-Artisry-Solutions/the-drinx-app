
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EventAttendee } from '@/types/EventTypes';
import { 
  fetchEventAttendees,
  addEventAttendee,
  updateEventAttendee,
  deleteEventAttendee,
  checkInAttendee,
  importAttendeesFromCSV
} from '@/services/eventAttendeesService';

export const useEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAttendees = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchEventAttendees(eventId);
      setAttendees(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load attendees',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, [eventId]);

  const addAttendee = async (attendee: EventAttendee) => {
    setIsLoading(true);
    try {
      const newAttendee = await addEventAttendee({
        ...attendee,
        event_id: eventId
      });
      setAttendees(prev => [...prev, newAttendee]);
      toast({
        title: 'Success',
        description: 'Attendee added successfully',
      });
      return newAttendee;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to add attendee',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttendee = async (id: string, updates: Partial<EventAttendee>) => {
    setIsLoading(true);
    try {
      const updated = await updateEventAttendee(id, updates);
      setAttendees(prev => 
        prev.map(a => a.id === id ? { ...a, ...updated } : a)
      );
      toast({
        title: 'Success',
        description: 'Attendee updated successfully',
      });
      return updated;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update attendee',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeAttendee = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteEventAttendee(id);
      setAttendees(prev => prev.filter(a => a.id !== id));
      toast({
        title: 'Success',
        description: 'Attendee removed successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove attendee',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIn = async (attendeeId: string, location?: string, notes?: string) => {
    setIsLoading(true);
    try {
      const result = await checkInAttendee(eventId, attendeeId, location, notes);
      // Update the attendee in the local state
      setAttendees(prev => 
        prev.map(a => a.id === attendeeId ? { 
          ...a, 
          status: 'checked_in',
          checked_in_at: new Date().toISOString()
        } : a)
      );
      toast({
        title: 'Check-in Successful',
        description: 'Attendee has been checked in',
      });
      return result;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to check in attendee',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const importAttendees = async (csv: string) => {
    setIsLoading(true);
    try {
      const result = await importAttendeesFromCSV(eventId, csv);
      if (result.success) {
        loadAttendees(); // Reload the list to get the new attendees
        toast({
          title: 'Import Successful',
          description: `Imported ${result.imported} attendees`,
        });
      } else {
        toast({
          title: 'Import Error',
          description: `Failed to import attendees: ${result.errors.join(', ')}`,
          variant: 'destructive'
        });
      }
      return result;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to import attendees',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    attendees,
    isLoading,
    error,
    addAttendee,
    updateAttendee,
    removeAttendee,
    checkIn,
    importAttendees,
    refresh: loadAttendees
  };
};
