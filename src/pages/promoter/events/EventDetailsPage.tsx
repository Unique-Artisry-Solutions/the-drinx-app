import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash, Users, Calendar, Clock, MapPin, ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useEventDetails } from '@/hooks/events/useEventDetails';
import { useEventService } from '@/hooks/events/useEventService';
import ShareScannerButton from '@/components/events/ShareScannerButton';
import MarketingTabContent from '@/components/events/MarketingTabContent';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, error } = useEventDetails(eventId || '');
  const { updateStatus, isLoading: isUpdatingStatus } = useEventService();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    if (error) {
      console.error("Error fetching event details:", error);
    }
  }, [error]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!eventId) return;
    const success = await updateStatus(eventId, newStatus);
    if (success) {
      console.log(`Event status updated to ${newStatus}`);
    }
  };

  const handleCancelEvent = async () => {
    if (!eventId) return;
    // Here you would typically send the cancellation reason to the backend
    console.log("Cancellation Reason:", cancellationReason);
    const success = await updateStatus(eventId, 'cancelled');
    if (success) {
      setShowConfirmation(false);
      setCancellationReason('');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {isLoading ? (
          <div className="text-center">Loading event details...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : event ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {event.status && (
                      <Badge variant="secondary">{event.status}</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {event.date} at {event.time} - {event.venue?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                    <p>{event.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{event.venue?.name}, {event.venue?.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span>{event.attendees?.registered} Registered</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Actions</h3>
                    <div className="space-y-2">
                      <ShareScannerButton eventId={eventId} />
                      {event.status !== 'cancelled' && (
                        <Button
                          variant="destructive"
                          onClick={() => setShowConfirmation(true)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Cancel Event
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-end">
                  {event.status === 'draft' && (
                    <Button onClick={() => handleStatusUpdate('published')}>
                      Publish Event <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  {event.status === 'published' && (
                    <Button onClick={() => handleStatusUpdate('completed')}>
                      Mark as Completed <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            <Tabs defaultValue="marketing" className="space-y-4">
              <TabsList>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="checkin">Check-in</TabsTrigger>
              </TabsList>
              <TabsContent value="marketing">
                <MarketingTabContent eventId={eventId} eventName={event.name} />
              </TabsContent>
              <TabsContent value="attendees">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendees</CardTitle>
                    <CardDescription>Manage event attendees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Attendee management content goes here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="checkin">
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in</CardTitle>
                    <CardDescription>Manage event check-ins</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Check-in content goes here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center">Event not found.</div>
        )}

        {/* Cancellation Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Cancel Event
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this event? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="reason" className="text-right">
                  Reason
                </label>
                <textarea
                  id="reason"
                  className="col-span-3 rounded-md border border-gray-200 px-2 py-1 shadow-sm focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                onClick={handleCancelEvent}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <>
                    Cancelling...
                    <svg className="ml-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2V4A8 8 0 0 1 20 12H22A10 10 0 0 0 12 2Z" opacity=".5"/>
                      <path fill="currentColor" d="M12 22A10 10 0 0 0 2 12H4A8 8 0 0 1 12 20V22Z"/>
                    </svg>
                  </>
                ) : (
                  <>
                    Cancel Event
                    <XCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
