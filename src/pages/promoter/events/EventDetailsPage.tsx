
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  Share, 
  BarChart3, 
  MessageCircle,
  ChevronLeft,
  Edit,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useEventDetails } from '@/hooks/events/useEventDetails';
import { useEventService } from '@/hooks/events/useEventService';
import ShareScannerButton from '@/components/events/ShareScannerButton';
import { MarketingTabContent } from '@/components/events/MarketingTabContent';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { event, isLoading, error } = useEventDetails(eventId);
  const { updateStatus } = useEventService();
  
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isScannerDialogOpen, setIsScannerDialogOpen] = useState(false);
  const [isTicketTypeDialogOpen, setIsTicketTypeDialogOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);
  const [isAttendeeDetailOpen, setIsAttendeeDetailOpen] = useState(false);
  
  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'cancelled' | 'completed') => {
    if (!eventId) return;
    
    setIsChangingStatus(true);
    try {
      await updateStatus(eventId, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Event status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update event status",
        variant: "destructive"
      });
    } finally {
      setIsChangingStatus(false);
    }
  };
  
  const handleEditEvent = () => {
    navigate(`/promoter/events/create?edit=${eventId}`);
  };
  
  const getStatusBadge = () => {
    if (!event) return null;
    
    let variant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning";
    
    switch (event.status) {
      case 'published':
        variant = "success";
        break;
      case 'draft':
        variant = "secondary";
        break;
      case 'cancelled':
        variant = "destructive";
        break;
      case 'completed':
        variant = "outline";
        break;
      default:
        variant = "outline";
    }
    
    const statusText = event.status === 'published' ? 'Published' : 
                       event.status === 'draft' ? 'Draft' :
                       event.status === 'cancelled' ? 'Cancelled' :
                       event.status === 'completed' ? 'Completed' : 'Unknown';
    
    return (
      <Badge variant={variant} className="ml-2">
        {statusText}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-12 w-3/5 bg-slate-200 rounded mb-4"></div>
            <div className="h-60 bg-slate-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-gray-500 mb-6">
              {error || "The event you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate('/promoter/events')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <Button 
                variant="ghost" 
                className="pl-0" 
                onClick={() => navigate('/promoter/events')}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{event.name}</h1>
              {getStatusBadge()}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditEvent}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            {event.status === 'draft' && (
              <Button 
                onClick={() => handleStatusChange('published')} 
                disabled={isChangingStatus}
              >
                <Check className="mr-2 h-4 w-4" />
                Publish Event
              </Button>
            )}
            
            {event.status === 'published' && (
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange('cancelled')} 
                disabled={isChangingStatus}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Event
              </Button>
            )}
          </div>
        </div>
        
        {/* Event Banner */}
        <div 
          className="w-full h-60 rounded-lg bg-cover bg-center mb-8 relative"
          style={{ 
            backgroundImage: event.image_url ? `url(${event.image_url})` : 'url(/featuresBG.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.venue?.name || 'Location TBD'}</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-2">
            <ShareScannerButton 
              eventId={event.id!} 
              eventName={event.name}
            />
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-3xl mb-6">
            <TabsTrigger value="overview" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="attendees" className="flex-1">
              <Ticket className="h-4 w-4 mr-2" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex-1">
              <Share className="h-4 w-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {event.description || "No description provided for this event."}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Date & Time</h3>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 mr-2" /> {/* Spacer for alignment */}
                          <span>{event.time}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Location</h3>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                          <div>
                            <div>{event.venue?.name || 'Location TBD'}</div>
                            <div className="text-sm text-gray-500">
                              {event.venue?.address || ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Capacity</h3>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.capacity ? `${event.capacity} attendees maximum` : 'No capacity limit set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                    Key metrics for your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Registrations</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          {event.attendees?.registered || 0}
                        </span>
                        {event.capacity ? (
                          <span className="ml-2 text-sm text-gray-500">
                            of {event.capacity} capacity
                          </span>
                        ) : null}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Check-ins</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          {event.attendees?.checked_in || 0}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          attendees
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Tickets</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          {event.ticketTypes?.length || 0}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          types available
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendees" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Event Attendees</h2>
              <p>This tab will contain the list of attendees, check-in functionality, etc.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="marketing" className="mt-0">
            <MarketingTabContent 
              eventId={eventId} 
              eventName={event.name} 
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Event Analytics</h2>
              <p>This tab will contain analytics and reporting for the event.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Event Messages</h2>
              <p>This tab will contain messaging functionality for attendees.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
