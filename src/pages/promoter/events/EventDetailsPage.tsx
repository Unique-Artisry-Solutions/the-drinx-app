
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Users, Ticket, BarChart3, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventType, EventTicketType, EventAttendee } from '@/types/EventTypes';
import { supabase } from '@/integrations/supabase/client';
import TicketTypeModal from '@/components/events/TicketTypeModal';
import AttendeeDetailModal from '@/components/events/AttendeeDetailModal';
import CheckInScannerModal from '@/components/events/CheckInScannerModal';
import { createTicketType, updateTicketType, deleteTicketType } from '@/services/eventTicketService';
import { checkInAttendee } from '@/services/eventAttendeesService';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ticket types state
  const [ticketTypes, setTicketTypes] = useState<EventTicketType[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<EventTicketType | undefined>(undefined);

  // Attendees state
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState<EventAttendee | null>(null);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  
  // Check-in scanner state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
      fetchTicketTypes(eventId);
      fetchAttendees(eventId);
    }
  }, [eventId]);

  const fetchEventDetails = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venue_id (
            id,
            name,
            address
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Convert the data to our EventType
      setEvent(data as unknown as EventType);
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketTypes = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_ticket_types')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;

      // Get ticket sales data for available counts
      const { data: attendeeData, error: attendeeError } = await supabase
        .from('event_attendees')
        .select('ticket_type_id, status')
        .eq('event_id', eventId);

      if (attendeeError) throw attendeeError;

      // Calculate sales counts manually since we can't use .group()
      const salesByTicketType: Record<string, number> = {};
      
      // Count tickets that haven't been cancelled
      attendeeData.forEach(attendee => {
        if (attendee.status !== 'cancelled' && attendee.ticket_type_id) {
          salesByTicketType[attendee.ticket_type_id] = (salesByTicketType[attendee.ticket_type_id] || 0) + 1;
        }
      });

      // Calculate available tickets and add to response
      const enrichedTicketTypes = data.map(ticket => {
        const sold = salesByTicketType[ticket.id] || 0;
        const available = ticket.quantity - sold;
        
        return {
          id: ticket.id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.quantity,
          sold,
          available
        };
      });

      setTicketTypes(enrichedTicketTypes);
    } catch (err) {
      console.error('Error fetching ticket types:', err);
    }
  };

  const fetchAttendees = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', eventId)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      setAttendees(data);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  const handleCreateTicket = async (ticketData: Omit<EventTicketType, 'id' | 'sold' | 'available'>) => {
    if (!eventId) return;

    try {
      // Create the ticket type with the event ID
      const newTicket = await createTicketType({
        ...ticketData,
        event_id: eventId
      });

      // Update local state
      setTicketTypes(prev => [...prev, newTicket]);

      toast({
        title: "Ticket Created",
        description: "New ticket type has been created successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error Creating Ticket",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTicket = async (ticketData: Omit<EventTicketType, 'id' | 'sold' | 'available'>) => {
    if (!editingTicket?.id) return;

    try {
      const updatedTicket = await updateTicketType(editingTicket.id, ticketData);

      // Update local state
      setTicketTypes(prev => 
        prev.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket)
      );

      toast({
        title: "Ticket Updated",
        description: "Ticket type has been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error Updating Ticket",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket type? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTicketType(id);
      
      // Update local state
      setTicketTypes(prev => prev.filter(ticket => ticket.id !== id));

      toast({
        title: "Ticket Deleted",
        description: "Ticket type has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error Deleting Ticket",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async (attendeeId: string) => {
    if (!eventId) return;
    
    try {
      await checkInAttendee(eventId, attendeeId);
      
      // Update local state
      setAttendees(prev => prev.map(attendee => {
        if (attendee.id === attendeeId) {
          return {
            ...attendee,
            status: 'checked_in',
            checked_in_at: new Date().toISOString()
          };
        }
        return attendee;
      }));

      toast({
        title: "Check-In Successful",
        description: "Attendee has been checked in successfully.",
      });
      
      // Close modal if it's open
      if (isAttendeeModalOpen) {
        setIsAttendeeModalOpen(false);
      }
    } catch (err: any) {
      toast({
        title: "Check-In Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleScannerCheckIn = (attendee: EventAttendee) => {
    // Update local state with the checked-in attendee
    setAttendees(prev => {
      // Check if attendee already exists in the list
      const exists = prev.some(a => a.id === attendee.id);
      
      if (exists) {
        // Update existing attendee
        return prev.map(a => a.id === attendee.id ? attendee : a);
      } else {
        // Add new attendee to the list
        return [attendee, ...prev];
      }
    });
    
    // We don't need to call checkInAttendee because the scanner already did that
  };

  const openTicketModal = (ticket?: EventTicketType) => {
    setEditingTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const openAttendeeModal = (attendee: EventAttendee) => {
    setSelectedAttendee(attendee);
    setIsAttendeeModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Loading event details...</h2>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading event</h2>
        <p>{error || "Event not found"}</p>
        <Button onClick={() => navigate('/promoter/events')} className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground">
            {event.date} • {event.time} • {event.venue?.name || "No venue selected"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/promoter/events`)}
            variant="outline"
          >
            Back to Events
          </Button>
          <Button 
            onClick={() => navigate(`/promoter/events/create?edit=${event.id}`)}
          >
            Edit Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="attendees">
        <TabsList className="mb-6">
          <TabsTrigger value="attendees">
            <Users className="mr-2 h-4 w-4" />
            Attendees
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Ticket className="mr-2 h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="marketing">
            <Share2 className="mr-2 h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Attendees Tab */}
        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendees Management</CardTitle>
                  <CardDescription>
                    Manage attendees and check-ins for {event.name}.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsScannerOpen(true)}
                  >
                    Scan Tickets
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {attendees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Ticket Code</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Purchase Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map(attendee => (
                        <tr 
                          key={attendee.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => openAttendeeModal(attendee)}
                        >
                          <td className="px-4 py-3">{attendee.name || 'N/A'}</td>
                          <td className="px-4 py-3">{attendee.email || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono">{attendee.ticket_code}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              attendee.status === 'checked_in' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              attendee.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {attendee.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {attendee.purchase_date ? new Date(attendee.purchase_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            {attendee.status !== 'checked_in' && attendee.status !== 'cancelled' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (attendee.id) {
                                    handleCheckIn(attendee.id);
                                  }
                                }}
                              >
                                Check In
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No attendees found for this event.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ticket Types</CardTitle>
                  <CardDescription>
                    Manage ticket types and pricing for {event.name}.
                  </CardDescription>
                </div>
                <Button onClick={() => openTicketModal()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Ticket Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ticketTypes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Sold</th>
                        <th className="px-4 py-3">Available</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketTypes.map(ticket => (
                        <tr key={ticket.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium">{ticket.name}</td>
                          <td className="px-4 py-3">{ticket.description}</td>
                          <td className="px-4 py-3">${ticket.price.toFixed(2)}</td>
                          <td className="px-4 py-3">{ticket.quantity}</td>
                          <td className="px-4 py-3">{ticket.sold || 0}</td>
                          <td className="px-4 py-3">{ticket.available || ticket.quantity}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => openTicketModal(ticket)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteTicket(ticket.id || '')}
                                disabled={(ticket.sold || 0) > 0}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No ticket types found. Create your first ticket type to start selling tickets.</p>
                  <Button 
                    onClick={() => openTicketModal()}
                    className="mt-4"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Ticket Type
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Marketing Tab - Placeholder */}
        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing</CardTitle>
              <CardDescription>
                Promote your event through various channels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Marketing tools will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab - Placeholder */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View insights about your event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics data will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <TicketTypeModal
        isOpen={isTicketModalOpen}
        onClose={() => {
          setIsTicketModalOpen(false);
          setEditingTicket(undefined);
        }}
        onSave={editingTicket ? handleUpdateTicket : handleCreateTicket}
        ticketType={editingTicket}
        isEditing={!!editingTicket}
      />
      
      <AttendeeDetailModal
        isOpen={isAttendeeModalOpen}
        onClose={() => {
          setIsAttendeeModalOpen(false);
          setSelectedAttendee(null);
        }}
        attendee={selectedAttendee}
        onCheckIn={attendee => {
          if (attendee) handleCheckIn(attendee);
        }}
      />
      
      <CheckInScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCheckIn={handleScannerCheckIn}
      />
    </div>
  );
};

export default EventDetailsPage;
