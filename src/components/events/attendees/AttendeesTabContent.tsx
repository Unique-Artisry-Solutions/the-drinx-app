
import React, { useState, useEffect } from 'react';
import { EventAttendee } from '@/types/EventTypes';
import { useEventAttendees } from '@/hooks/events/useEventAttendees';
import { useToast } from '@/hooks/use-toast';
import AttendeeFilters from './AttendeeFilters';
import AttendeesList from './AttendeesList';
import AttendeeDetailView from './AttendeeDetailView';

interface AttendeesTabContentProps {
  eventId: string;
}

const AttendeesTabContent: React.FC<AttendeesTabContentProps> = ({ eventId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAttendee, setSelectedAttendee] = useState<EventAttendee | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    attendees,
    isLoading,
    checkIn,
    updateAttendee,
    refresh
  } = useEventAttendees(eventId);

  // Filter attendees based on search query and status
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      attendee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.ticket_code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (attendeeId: string) => {
    const attendee = attendees.find(a => a.id === attendeeId) || null;
    setSelectedAttendee(attendee);
    setIsDetailViewOpen(true);
  };

  const handleCheckIn = async (attendeeId: string) => {
    try {
      await checkIn(attendeeId);
      toast({
        title: 'Success',
        description: 'Attendee checked in successfully',
      });
      
      // If the currently selected attendee was checked in, update the detail view
      if (selectedAttendee?.id === attendeeId) {
        const updatedAttendee = attendees.find(a => a.id === attendeeId);
        if (updatedAttendee) {
          setSelectedAttendee(updatedAttendee);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Check-in failed',
        description: err.message || 'An error occurred during check-in',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (attendeeId: string) => {
    try {
      await updateAttendee(attendeeId, { status: 'cancelled' });
      toast({
        title: 'Registration cancelled',
        description: 'Attendee registration has been cancelled',
      });
      
      // Update the local state if needed
      if (selectedAttendee?.id === attendeeId) {
        const updatedAttendee = attendees.find(a => a.id === attendeeId);
        if (updatedAttendee) {
          setSelectedAttendee(updatedAttendee);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Cancellation failed',
        description: err.message || 'An error occurred during cancellation',
        variant: 'destructive',
      });
    }
  };

  const handleAddNote = async (attendeeId: string, note: string) => {
    try {
      await updateAttendee(attendeeId, { notes: note });
      toast({
        title: 'Note added',
        description: 'Attendee note has been updated',
      });
      
      // Update the selected attendee
      if (selectedAttendee?.id === attendeeId) {
        const updatedAttendee = {
          ...selectedAttendee,
          notes: note
        };
        setSelectedAttendee(updatedAttendee);
      }
    } catch (err: any) {
      toast({
        title: 'Failed to add note',
        description: err.message || 'An error occurred while adding the note',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    // Generate CSV data
    const csvHeaders = [
      'Name', 'Email', 'Ticket Type', 'Status', 
      'Purchase Date', 'Checked In Date', 'Ticket Code'
    ].join(',');
    
    const csvRows = filteredAttendees.map(attendee => [
      attendee.name?.replace(/,/g, ' '),
      attendee.email?.replace(/,/g, ' '),
      attendee.ticket_type?.name || 'Standard',
      attendee.status,
      new Date(attendee.purchase_date).toLocaleString(),
      attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleString() : '',
      attendee.ticket_code
    ].join(','));
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendees-${eventId}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <AttendeeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExport={handleExport}
      />
      
      <AttendeesList
        attendees={filteredAttendees}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onCheckIn={handleCheckIn}
      />
      
      <AttendeeDetailView
        attendee={selectedAttendee}
        isOpen={isDetailViewOpen}
        onClose={() => setIsDetailViewOpen(false)}
        onCheckIn={handleCheckIn}
        onCancel={handleCancel}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default AttendeesTabContent;
