
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Calendar, Clock, MapPin, UsersRound, Clipboard, 
  BarChart3, Share2, Edit, Trash, QrCode, Upload, Download 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EventType, EventAttendee, EventTicketType } from '@/types/EventTypes';
import { useEventAttendees } from '@/hooks/events/useEventAttendees';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';
import { safeJsonToRecord } from '@/utils/typeGuards';
import { getEventAnalytics } from '@/services/eventAnalyticsService';
import { fetchEventTicketTypes, createTicketType, updateTicketType, processTicketScan } from '@/services/eventTicketService';
import AnalyticsDashboard from '@/components/events/AnalyticsDashboard';
import AttendeeDetailModal from '@/components/events/AttendeeDetailModal';
import CheckInScannerModal from '@/components/events/CheckInScannerModal';
import TicketTypeModal from '@/components/events/TicketTypeModal';
import MarketingCampaignModal from '@/components/events/MarketingCampaignModal';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // Attendee state
  const { attendees, isLoading: attendeesLoading, checkIn, refresh: refreshAttendees } = 
    useEventAttendees(eventId || '');
  const [selectedAttendee, setSelectedAttendee] = useState<EventAttendee | null>(null);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  
  // Ticket state
  const [ticketTypes, setTicketTypes] = useState<EventTicketType[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<EventTicketType | undefined>(undefined);
  
  // Marketing state
  const { campaigns, isLoading: campaignsLoading, createCampaign, updateCampaign, refresh: refreshCampaigns } = 
    useEventMarketing(eventId || '');
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | undefined>(undefined);
  
  // Analytics state
  const [eventAnalytics, setEventAnalytics] = useState({
    views: 0,
    uniqueVisitors: 0,
    ticketSales: 0,
    revenue: 0,
    conversionRate: 0,
  });
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) return;
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            establishments:venue_id (
              id, 
              name, 
              address
            ),
            event_ticket_types (*)
          `)
          .eq('id', eventId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Event not found');
        
        // Transform the data to match the EventType interface
        setEvent({
          id: data.id,
          name: data.name,
          description: data.description || '',
          date: data.date,
          time: data.time,
          venue_id: data.venue_id,
          image_url: data.image_url || '',
          promotional_materials: data.promotional_materials || [],
          status: data.status,
          ticketTypes: data.event_ticket_types.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            sold: 0,
            available: ticket.quantity
          })),
          venue: {
            id: data.establishments?.id || '',
            name: data.establishments?.name || 'No Venue',
            address: data.establishments?.address || ''
          },
          attendees: {
            registered: 0,
            capacity: data.capacity || 0,
            checkedIn: 0
          },
          revenue: {
            total: 0,
            ticketSales: 0,
            additionalSales: 0
          },
          capacity: data.capacity,
          eventType: data.event_type,
          locationDetails: safeJsonToRecord(data.location_details),
          contactInfo: safeJsonToRecord(data.contact_info),
          customSettings: safeJsonToRecord(data.custom_settings),
          isPublic: data.is_public,
          eventUrl: data.event_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          createdBy: data.created_by,
        });
        
        // Load ticket types with availability counts
        loadTicketTypes();
        
        // Load analytics data
        loadAnalyticsData();
        
      } catch (error: any) {
        toast({
          title: 'Error loading event',
          description: error.message,
          variant: 'destructive'
        });
        console.error('Error fetching event:', error);
        navigate('/promoter/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate, toast]);

  // Load ticket types with availability
  const loadTicketTypes = async () => {
    if (!eventId) return;
    
    try {
      const ticketData = await fetchEventTicketTypes(eventId);
      setTicketTypes(ticketData);
    } catch (error) {
      console.error('Error loading ticket types:', error);
    }
  };
  
  // Load analytics data
  const loadAnalyticsData = async () => {
    if (!eventId) return;
    
    setIsAnalyticsLoading(true);
    try {
      const analytics = await getEventAnalytics(eventId);
      setEventAnalytics(analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };
  
  // Handle ticket type save
  const handleSaveTicketType = async (ticketType: Omit<EventTicketType, 'id' | 'sold' | 'available'>) => {
    if (!eventId) return;
    
    try {
      if (selectedTicketType?.id) {
        await updateTicketType(selectedTicketType.id, ticketType);
      } else {
        await createTicketType({
          ...ticketType,
          event_id: eventId
        });
      }
      
      // Refresh ticket types
      loadTicketTypes();
      
      toast({
        title: 'Success',
        description: selectedTicketType?.id ? 'Ticket type updated' : 'Ticket type created'
      });
      
      setSelectedTicketType(undefined);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save ticket type',
        variant: 'destructive'
      });
    }
  };
  
  // Handle marketing campaign save
  const handleSaveCampaign = async (campaign: any) => {
    if (!eventId) return;
    
    try {
      if (selectedCampaign?.id) {
        await updateCampaign(selectedCampaign.id, campaign);
      } else {
        await createCampaign(campaign);
      }
      
      // Refresh campaigns
      refreshCampaigns();
      
      toast({
        title: 'Success',
        description: selectedCampaign?.id ? 'Campaign updated' : 'Campaign created'
      });
      
      setSelectedCampaign(undefined);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save campaign',
        variant: 'destructive'
      });
    }
  };
  
  // Handle attendee selection
  const handleSelectAttendee = (attendee: EventAttendee) => {
    setSelectedAttendee(attendee);
    setIsAttendeeModalOpen(true);
  };
  
  // Handle attendee check-in
  const handleCheckIn = async (attendeeId: string) => {
    try {
      await checkIn(attendeeId);
      setIsAttendeeModalOpen(false);
      refreshAttendees();
    } catch (error) {
      console.error('Check-in error:', error);
      throw error;
    }
  };
  
  // Handle QR code scan result
  const handleScanComplete = (attendee: EventAttendee) => {
    setIsScannerModalOpen(false);
    refreshAttendees();
    toast({
      title: 'Check-in Complete',
      description: `${attendee.name || 'Attendee'} has been checked in successfully.`
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1>Event not found</h1>
          <Button asChild>
            <Link to="/promoter/events">Back to Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/promoter/events')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="flex justify-between items-start flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(event.status)}>
                  {event.status.toUpperCase()}
                </Badge>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  {event.time}
                </div>
              </div>
              {event.venue_id && (
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  {event.venue.name}, {event.venue.address}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attendees">
                Attendees 
                {!attendeesLoading && attendees.length > 0 && (
                  <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    {attendees.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="marketing">
                Marketing
                {!campaignsLoading && campaigns.length > 0 && (
                  <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    {campaigns.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {event.description ? (
                        <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                      ) : (
                        <p className="text-gray-400 italic">No description provided</p>
                      )}
                      
                      {event.eventType && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm">Event Type</h4>
                          <p>{event.eventType}</p>
                        </div>
                      )}
                      
                      {event.capacity && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm">Capacity</h4>
                          <p>{event.capacity} attendees</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {event.image_url && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Event Media</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={event.image_url} 
                          alt={event.name} 
                          className="w-full h-64 object-cover rounded-md"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Status</span>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Date</span>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Time</span>
                        <span className="font-medium">{event.time}</span>
                      </div>
                      
                      {event.venue_id && (
                        <>
                          <Separator />
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Venue</span>
                            <div className="font-medium mt-1">{event.venue.name}</div>
                            <div className="text-sm text-gray-500">{event.venue.address}</div>
                          </div>
                        </>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Ticket Types</span>
                        <span className="font-medium">{ticketTypes.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Public Event</span>
                        <span className="font-medium">{event.isPublic ? 'Yes' : 'No'}</span>
                      </div>
                      
                      {event.eventUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Event URL</span>
                          <a href={event.eventUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            View
                          </a>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Event
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Quick Access</CardTitle>
                      <CardDescription>Common tools for this event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('attendees')}>
                        <UsersRound className="mr-2 h-4 w-4" />
                        Manage Attendees
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('tickets')}>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Manage Tickets
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('marketing')}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Marketing Tools
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('analytics')}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="attendees">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Attendee Management</CardTitle>
                    <CardDescription>
                      Manage attendees for {event.name}. Current count: {attendees.length}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsScannerModalOpen(true)}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Scan Tickets
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {attendeesLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : attendees.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {attendees.map((attendee) => (
                              <tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">{attendee.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{attendee.email || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={
                                    attendee.status === 'checked_in' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    attendee.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  }>
                                    {attendee.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleSelectAttendee(attendee)}
                                    >
                                      View
                                    </Button>
                                    {attendee.status !== 'checked_in' && attendee.status !== 'cancelled' && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleCheckIn(attendee.id!)}
                                      >
                                        Check In
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <UsersRound className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No attendees</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by adding your first attendee or importing a list.
                      </p>
                      <div className="mt-6">
                        <Button>Add Attendee</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button>
                    Add Attendee
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export List
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="tickets">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Ticket Management</CardTitle>
                    <CardDescription>
                      Manage ticket types and pricing for {event.name}
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setSelectedTicketType(undefined);
                    setIsTicketModalOpen(true);
                  }}>
                    Add Ticket Type
                  </Button>
                </CardHeader>
                <CardContent>
                  {ticketTypes.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Available</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sold</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {ticketTypes.map((ticket) => (
                              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.name}</td>
                                <td className="px-6 py-4">
                                  <div className="max-w-xs truncate">{ticket.description || 'No description'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">${ticket.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{ticket.available} of {ticket.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{ticket.sold || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedTicketType(ticket);
                                      setIsTicketModalOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Clipboard className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No ticket types</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first ticket type.
                      </p>
                      <div className="mt-6">
                        <Button onClick={() => {
                          setSelectedTicketType(undefined);
                          setIsTicketModalOpen(true);
                        }}>
                          Add Ticket Type
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {ticketTypes.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Ticket Sales Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</div>
                        <div className="text-2xl font-bold mt-1">
                          {ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Tickets Sold</div>
                        <div className="text-2xl font-bold mt-1">
                          {ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
                        <div className="text-2xl font-bold mt-1">
                          ${ticketTypes.reduce((sum, ticket) => sum + ((ticket.sold || 0) * ticket.price), 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="mb-2 flex justify-between">
                        <div className="text-sm font-medium">Sales Progress</div>
                        <div className="text-sm text-gray-500">
                          {Math.round((ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0) / 
                            ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)) * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.round((ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0) / 
                              ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Marketing Campaigns</CardTitle>
                    <CardDescription>
                      Manage marketing campaigns for {event.name}
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setSelectedCampaign(undefined);
                    setIsMarketingModalOpen(true);
                  }}>
                    Create Campaign
                  </Button>
                </CardHeader>
                <CardContent>
                  {campaignsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : campaigns.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Performance</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {campaigns.map((campaign) => (
                              <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{campaign.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{campaign.campaign_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={
                                    campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                    campaign.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  }>
                                    {campaign.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {campaign.metrics ? 
                                    `${Object.values(campaign.metrics).reduce((a: any, b: any) => a + b, 0)} clicks` :
                                    'No data'
                                  }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCampaign(campaign);
                                        setIsMarketingModalOpen(true);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      View Analytics
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Share2 className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No marketing campaigns</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first marketing campaign.
                      </p>
                      <div className="mt-6">
                        <Button onClick={() => {
                          setSelectedCampaign(undefined);
                          setIsMarketingModalOpen(true);
                        }}>
                          Create Campaign
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {campaigns.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Marketing Insights</CardTitle>
                    <CardDescription>
                      Performance metrics for your marketing campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Campaigns</div>
                        <div className="text-2xl font-bold mt-1">{campaigns.length}</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Active Campaigns</div>
                        <div className="text-2xl font-bold mt-1">
                          {campaigns.filter(c => c.status === 'active').length}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Budget</div>
                        <div className="text-2xl font-bold mt-1">
                          ${campaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple campaign type distribution chart */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Campaign Types</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {['email', 'social', 'sms', 'push', 'partner'].map(type => {
                          const count = campaigns.filter(c => c.campaign_type === type).length;
                          const percentage = campaigns.length > 0 ? Math.round((count / campaigns.length) * 100) : 0;
                          
                          return (
                            <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                              <div className="text-xs text-gray-500 capitalize">{type}</div>
                              <div className="font-medium mt-1">{count}</div>
                              <div className="w-full bg-gray-200 h-1 mt-1 rounded">
                                <div 
                                  className="bg-blue-500 h-1 rounded" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard 
                eventId={eventId || ''}
                eventAnalytics={eventAnalytics}
                isLoading={isAnalyticsLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Modals */}
      <AttendeeDetailModal
        attendee={selectedAttendee}
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        onCheckIn={handleCheckIn}
      />
      
      <CheckInScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onCheckIn={handleScanComplete}
      />
      
      <TicketTypeModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSave={handleSaveTicketType}
        ticketType={selectedTicketType}
        isEditing={!!selectedTicketType?.id}
      />
      
      <MarketingCampaignModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
        onSave={handleSaveCampaign}
        campaign={selectedCampaign}
        isEditing={!!selectedCampaign?.id}
      />
    </Layout>
  );
};

export default EventDetailsPage;
