
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useEventDetails } from '@/hooks/events/useEventDetails';
import { useEventService } from '@/hooks/events/useEventService';
import { EventStatus } from '@/types/EventTypes';
import EventHeader from '@/components/events/EventHeader';
import EventDetails from '@/components/events/EventDetails';
import EventFooter from '@/components/events/EventFooter';
import EventTabsSection from '@/components/events/EventTabsSection';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, error } = useEventDetails(eventId || '');
  const { updateStatus } = useEventService();

  useEffect(() => {
    if (error) {
      console.error("Error fetching event details:", error);
    }
  }, [error]);

  const handleStatusUpdate = async (newStatus: EventStatus) => {
    if (!eventId) return;
    const success = await updateStatus(eventId, newStatus);
    if (success) {
      console.log(`Event status updated to ${newStatus}`);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {isLoading ? (
          <div className="text-center">Loading event details...</div>
        ) : error ? (
          <ErrorDisplay 
            error={error}
            title="Error loading event details"
            onRetry={handleRetry}
            className="mb-4"
          />
        ) : event ? (
          <div className="space-y-6">
            <Card>
              <EventHeader event={event} />
              <EventDetails event={event} eventId={eventId || ''} />
              <EventFooter status={event.status} onStatusUpdate={handleStatusUpdate} />
            </Card>

            <EventTabsSection eventId={eventId} eventName={event.name} />
          </div>
        ) : (
          <div className="text-center">Event not found.</div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
