
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MarketingTabContent from '@/components/events/MarketingTabContent';
import AttendeeSegmentsTab from '@/components/events/AttendeeSegmentsTab';
import AttendeesTabContent from '@/components/events/attendees/AttendeesTabContent';
import CheckInTabContent from '@/components/events/check-in/CheckInTabContent';

interface EventTabsSectionProps {
  eventId: string | undefined;
  eventName: string;
}

const EventTabsSection: React.FC<EventTabsSectionProps> = ({ eventId, eventName }) => {
  return (
    <Tabs defaultValue="marketing" className="space-y-4">
      <TabsList>
        <TabsTrigger value="marketing">Marketing</TabsTrigger>
        <TabsTrigger value="attendees">Attendees</TabsTrigger>
        <TabsTrigger value="segments">Segments</TabsTrigger>
        <TabsTrigger value="checkin">Check-in</TabsTrigger>
      </TabsList>
      <TabsContent value="marketing">
        <MarketingTabContent eventId={eventId || ''} eventName={eventName} />
      </TabsContent>
      <TabsContent value="segments">
        <AttendeeSegmentsTab eventId={eventId || ''} eventName={eventName} />
      </TabsContent>
      <TabsContent value="attendees">
        {eventId ? (
          <AttendeesTabContent eventId={eventId} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>Manage event attendees</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please save the event first to manage attendees.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="checkin">
        {eventId ? (
          <CheckInTabContent eventId={eventId} eventName={eventName} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Check-in</CardTitle>
              <CardDescription>Manage event check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please save the event first to access check-in functionality.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EventTabsSection;
