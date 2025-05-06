import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useEventDetails } from '@/hooks/events/useEventDetails';
import { useEventStatus } from '@/hooks/events/useEventStatus';
import { AlertCircle, Calendar, Clock, MapPin, Ticket, Users, Check, Globe, X, AlertTriangle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCodeScanner from '@/components/events/QrCodeScanner';
import AttendeeDetailModal from '@/components/events/AttendeeDetailModal';
import AnalyticsDashboard from '@/components/events/AnalyticsDashboard';
import TicketTypeModal from '@/components/events/TicketTypeModal';
import IntegrationsPanel from '@/components/events/IntegrationsPanel';
import SocialSharingPanel from '@/components/events/SocialSharingPanel';
import { useEventAttendees } from '@/hooks/events/useEventAttendees';
import { checkInAttendee } from '@/services/eventAttendeesService';
import { toAttendeeStatus, safeJsonToRecord } from '@/utils/typeGuards';
import { MarketingTabContent } from '@/components/events/MarketingTabContent';
import ShareScannerButton from '@/components/events/ShareScannerButton';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, isLoading, error } = useEventDetails(eventId || '');
  const { updateEventStatus } = useEventStatus(eventId || '');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [showTicketTypeModal, setShowTicketTypeModal] = useState(false);
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusChange, setStatusChange] = useState('');

  const { 
    attendees, 
    isLoading: isLoadingAttendees, 
    error: attendeesError,
    refresh: refreshAttendees
  } = useEventAttendees(eventId || '');

  useEffect(() => {
    if (event) {
      setIsOnlineEvent(event.event_type === 'online');
    }
  }, [event]);

  const handleStatusChange = async (status: string) => {
    setStatusChange(status);
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    if (!eventId) return;

    try {
      await updateEventStatus(statusChange);
      toast({
        title: "Event status updated",
        description: `Event status changed to ${statusChange}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating event status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setShowConfirmation(false);
      setStatusChange('');
    }
  };

  const handleAttendeeCheckIn = async (attendeeId: string) => {
    try {
      await checkInAttendee(attendeeId);
      refreshAttendees();
      toast({
        title: "Attendee checked in",
        description: "Attendee has been successfully checked in.",
      });
    } catch (error: any) {
      toast({
        title: "Error checking in attendee",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAttendeeClick = (attendee: any) => {
    setSelectedAttendee(attendee);
    setShowAttendeeModal(true);
  };

  const renderStatusBadge = () => {
    if (!event) return null;

    let badgeVariant = "default";
    if (event.status === "draft") badgeVariant = "outline";
    if (event.status === "cancelled") badgeVariant = "destructive";
    if (event.status === "live") badgeVariant = "success";
    if (event.status === "past") badgeVariant = "secondary";

    return (
      <Badge variant={badgeVariant}>
        {event.status}
      </Badge>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-4 text-lg">Loading event details...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Event</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/promoter/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="flex flex-col items-center py-20">
          <AlertCircle className="h-12 w-12 text-warning mb-4" />
          <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/promoter/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="md:flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <div className="flex items-center gap-2">
              {renderStatusBadge()}
              {event.is_public ? (
                <Badge variant="success"><Globe className="h-3 w-3 mr-1" /> Public</Badge>
              ) : (
                <Badge variant="secondary"><X className="h-3 w-3 mr-1" /> Private</Badge>
              )}
            </div>
          </div>
          <div className="space-x-2 mt-4 md:mt-0">
            <Button onClick={() => navigate(`/promoter/events/edit/${eventId}`)}>
              Edit Event
            </Button>
            <Button variant="destructive" onClick={() => handleStatusChange('cancelled')}>
              Cancel Event
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="social">Social Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Event Information</h2>
                    <div className="flex items-start gap-3 mb-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Date</h4>
                        <p className="text-gray-700">{format(parseISO(event.date), 'MMMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Time</h4>
                        <p className="text-gray-700">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-gray-700">{event.venue?.name || 'TBD'}</p>
                        <p className="text-gray-500 text-sm">{event.venue?.address || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <Users className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Attendees</h4>
                        <p className="text-gray-700">{event.attendees?.registered || 0} registered</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">Tickets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    event.ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">{ticket.name}</h4>
                          <p className="text-sm text-gray-500">{ticket.description}</p>
                        </div>
                        <div>
                          <Badge variant="secondary">{ticket.price > 0 ? `$${ticket.price}` : 'Free'}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No tickets available for this event.</div>
                  )}
                </div>
                <Button onClick={() => setShowTicketTypeModal(true)} className="mt-4">
                  <Ticket className="h-4 w-4 mr-2" />
                  Manage Tickets
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Attendees</h2>
              <div className="flex space-x-2">
                <ShareScannerButton eventId={eventId} />
                <Button onClick={() => setShowScanner(true)}>
                  <Check className="h-4 w-4 mr-2" />
                  Check-In Attendees
                </Button>
              </div>
            </div>

            {isLoadingAttendees ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading attendees...</span>
              </div>
            ) : attendeesError ? (
              <div className="text-red-500">{attendeesError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendees?.map(attendee => (
                  <Card key={attendee.id} className="cursor-pointer" onClick={() => handleAttendeeClick(attendee)}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{attendee.name}</h3>
                        <p className="text-sm text-gray-500">{attendee.email}</p>
                      </div>
                      {attendee.status === 'checked_in' ? (
                        <Badge variant="success">Checked In</Badge>
                      ) : (
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleAttendeeCheckIn(attendee.id);
                        }}>Check In</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard eventId={eventId} />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingTabContent eventId={eventId} eventName={event.name} />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsPanel eventId={eventId} />
          </TabsContent>

          <TabsContent value="social">
            <SocialSharingPanel eventId={eventId} eventName={event.name} eventUrl={event.event_url || ''} />
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {renderContent()}

        {/* QR Code Scanner Dialog */}
        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan Attendee QR Code</DialogTitle>
              <DialogDescription>
                Point your camera at the attendee's QR code to check them in.
              </DialogDescription>
            </DialogHeader>
            <QRCodeScanner 
              onResult={(result) => {
                handleAttendeeCheckIn(result);
                setShowScanner(false);
              }}
              onError={(error) => {
                console.error(error);
                toast({
                  title: "Error scanning QR code",
                  description: error.message,
                  variant: "destructive",
                });
                setShowScanner(false);
              }}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowScanner(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Attendee Detail Modal */}
        <AttendeeDetailModal 
          open={showAttendeeModal}
          onOpenChange={setShowAttendeeModal}
          attendee={selectedAttendee}
        />

        {/* Ticket Type Modal */}
        <TicketTypeModal 
          open={showTicketTypeModal}
          onOpenChange={setShowTicketTypeModal}
          eventId={eventId}
        />

        {/* Status Change Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change the event status to {statusChange}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmStatusChange}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
