
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EventDetails } from '@/services/promoterAnalyticsService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';

interface EventPerformanceDetailProps {
  eventData: EventDetails | null;
  isLoading: boolean;
  onClose: () => void;
}

const EventPerformanceDetail: React.FC<EventPerformanceDetailProps> = ({
  eventData,
  isLoading,
  onClose
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!eventData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Event Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No event data available</p>
        </CardContent>
      </Card>
    );
  }

  // Create data for the revenue breakdown chart
  const ticketRevenueData = eventData.ticket_breakdown.map(ticket => ({
    name: ticket.ticket_type,
    value: ticket.revenue
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{eventData.name}</CardTitle>
          <CardDescription>
            {eventData.date} • {eventData.venue_name}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Attendees</h4>
            <p className="text-2xl font-bold">{eventData.total_attendees}</p>
            <div className="mt-1 text-xs">
              <span className="text-green-600">↑ {eventData.historical_comparison.attendee_growth}%</span>
              <span className="text-muted-foreground"> vs. previous</span>
            </div>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Revenue</h4>
            <p className="text-2xl font-bold">${eventData.total_revenue}</p>
            <div className="mt-1 text-xs">
              <span className="text-green-600">↑ {eventData.historical_comparison.revenue_growth}%</span>
              <span className="text-muted-foreground"> vs. previous</span>
            </div>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Avg. per Attendee</h4>
            <p className="text-2xl font-bold">
              ${(eventData.total_revenue / eventData.total_attendees).toFixed(2)}
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              Per person spending
            </div>
          </div>
        </div>

        {/* Ticket Breakdown */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-3">Ticket Sales Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventData.ticket_breakdown.map((ticket, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{ticket.ticket_type}</TableCell>
                    <TableCell>${ticket.price}</TableCell>
                    <TableCell>{ticket.quantity_sold}</TableCell>
                    <TableCell>${ticket.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="h-[250px]">
            <h3 className="font-medium mb-3">Revenue Distribution</h3>
            <AnalyticsPieChart
              title=""
              description=""
              data={ticketRevenueData}
              colors={['#3B82F6', '#EC4899', '#F59E0B', '#10B981']}
            />
          </div>
        </div>

        {/* Audience Demographics */}
        <div>
          <h3 className="font-medium mb-3">Attendance Demographics</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {eventData.attendance_demographics.map((demo, idx) => (
              <div key={idx} className="rounded-lg border p-3 bg-muted/20">
                <h4 className="text-sm font-medium">{demo.category}</h4>
                <p className="text-lg font-bold">{demo.value} attendees</p>
                <p className="text-xs text-muted-foreground">{demo.percentage}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Comparison */}
        <div>
          <h3 className="font-medium mb-3">Comparison with Previous Event</h3>
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Previous Event</h4>
                <p className="text-base font-medium">
                  {eventData.historical_comparison.event_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {eventData.historical_comparison.previous_date}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Attendance Change</h4>
                <div className="flex items-baseline gap-1">
                  <p className="text-base font-medium">
                    {eventData.historical_comparison.previous_attendees} → {eventData.total_attendees}
                  </p>
                  <span className="text-xs text-green-600">
                    (+{eventData.historical_comparison.attendee_growth}%)
                  </span>
                </div>
                
                <h4 className="text-sm font-medium text-muted-foreground mt-2">Revenue Change</h4>
                <div className="flex items-baseline gap-1">
                  <p className="text-base font-medium">
                    ${eventData.historical_comparison.previous_revenue} → ${eventData.total_revenue}
                  </p>
                  <span className="text-xs text-green-600">
                    (+{eventData.historical_comparison.revenue_growth}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventPerformanceDetail;
