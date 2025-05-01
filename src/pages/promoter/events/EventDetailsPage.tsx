
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, MapPin, UsersRound, Clipboard, BarChart3, Share2, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EventType } from '@/types/EventTypes';
import { useEventAttendees } from '@/hooks/events/useEventAttendees';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  const { attendees, isLoading: attendeesLoading } = useEventAttendees(eventId || '');
  const { campaigns, isLoading: campaignsLoading } = useEventMarketing(eventId || '');

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
          locationDetails: data.location_details || {},
          contactInfo: data.contact_info || {},
          customSettings: data.custom_settings || {},
          isPublic: data.is_public,
          eventUrl: data.event_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          createdBy: data.created_by,
        });
        
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
                        <span className="font-medium">{event.ticketTypes.length}</span>
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
                <CardHeader>
                  <CardTitle>Attendee Management</CardTitle>
                  <CardDescription>
                    Manage attendees for {event.name}. Current count: {attendees.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {attendeesLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : attendees.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
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
                            <tr key={attendee.id}>
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
                                  <Button variant="outline" size="sm">View</Button>
                                  {attendee.status !== 'checked_in' && (
                                    <Button variant="outline" size="sm">Check In</Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <UsersRound className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No attendees</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by adding your first attendee.
                      </p>
                      <div className="mt-6">
                        <Button>Add Attendee</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button>Add Attendee</Button>
                    <Button variant="outline">Import CSV</Button>
                    <Button variant="outline">Export List</Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Management</CardTitle>
                  <CardDescription>
                    Manage ticket types and pricing for {event.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.ticketTypes.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {event.ticketTypes.map((ticket) => (
                            <tr key={ticket.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{ticket.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${ticket.price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{ticket.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{ticket.sold || 0}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="outline" size="sm">Edit</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Clipboard className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No ticket types</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first ticket type.
                      </p>
                      <div className="mt-6">
                        <Button>Add Ticket Type</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button>Add Ticket Type</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Campaigns</CardTitle>
                  <CardDescription>
                    Manage marketing campaigns for {event.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {campaignsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : campaigns.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {campaigns.map((campaign) => (
                            <tr key={campaign.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{campaign.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{campaign.campaign_type}</td>
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
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm">Edit</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Share2 className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No marketing campaigns</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first marketing campaign.
                      </p>
                      <div className="mt-6">
                        <Button>Create Campaign</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button>Create Campaign</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics for {event.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Registrations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{attendees.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.capacity ? `${Math.round((attendees.length / event.capacity) * 100)}% of capacity` : 'No capacity set'}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Check-ins</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {attendees.filter(a => a.status === 'checked_in').length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {attendees.length > 0 ? 
                            `${Math.round((attendees.filter(a => a.status === 'checked_in').length / attendees.length) * 100)}% check-in rate` : 
                            'No attendees'
                          }
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${event.revenue.total.toFixed(2)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          From ticket sales and other sources
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Marketing Campaigns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {campaigns.length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaigns.filter(c => c.status === 'active').length} active
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Analytics Dashboard</h3>
                    <div className="text-center py-10 border rounded-md">
                      <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Detailed analytics coming soon</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Advanced analytics for your event are in development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
