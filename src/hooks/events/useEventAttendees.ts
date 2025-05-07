
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventAttendee } from '@/types/EventTypes';
import { 
  fetchEventAttendees, 
  checkInAttendee, 
  cancelAttendeeRegistration, 
  markAttendeeAsNoShow 
} from '@/services/eventAttendeesService';

export const useEventAttendees = (eventId: string) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const { data: attendees = [], isLoading, error } = useQuery({
    queryKey: ['eventAttendees', eventId],
    queryFn: () => fetchEventAttendees(eventId),
    enabled: !!eventId
  });

  // Check-in attendee mutation
  const checkInMutation = useMutation({
    mutationFn: (attendeeId: string) => checkInAttendee(eventId, attendeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] });
    }
  });

  // Cancel registration mutation
  const cancelRegistrationMutation = useMutation({
    mutationFn: (attendeeId: string) => cancelAttendeeRegistration(attendeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] });
    }
  });

  // Mark as no-show mutation
  const markNoShowMutation = useMutation({
    mutationFn: (attendeeId: string) => markAttendeeAsNoShow(attendeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] });
    }
  });

  // Filter and search attendees
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = !searchQuery || 
      (attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       attendee.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
      (filter === 'checked_in' && attendee.status === 'checked_in') ||
      (filter === 'registered' && attendee.status === 'registered') ||
      (filter === 'cancelled' && attendee.status === 'cancelled') ||
      (filter === 'no_show' && attendee.status === 'no_show');
    
    return matchesSearch && matchesFilter;
  });

  // Wrap the mutations to return void instead of EventAttendee
  const checkIn = async (attendeeId: string): Promise<void> => {
    await checkInMutation.mutateAsync(attendeeId);
  };

  const cancelRegistration = async (attendeeId: string): Promise<void> => {
    await cancelRegistrationMutation.mutateAsync(attendeeId);
  };

  const markAsNoShow = async (attendeeId: string): Promise<void> => {
    await markNoShowMutation.mutateAsync(attendeeId);
  };

  return {
    attendees: filteredAttendees,
    allAttendees: attendees,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    checkIn,
    cancelRegistration,
    markAsNoShow,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] })
  };
};
