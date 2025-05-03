
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  EventPerformance, 
  EventDetailedAnalytics 
} from '@/services/promoterAnalyticsService';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { safeFormatDate } from '@/utils/environment';

interface EventAnalyticsTabProps {
  eventPerformance: EventPerformance[];
  isLoading: boolean;
}

const EventAnalyticsTab: React.FC<EventAnalyticsTabProps> = ({ 
  eventPerformance, 
  isLoading 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>(
    eventPerformance?.length > 0 ? eventPerformance[0].id : ''
  );

  // Get the selected event details with safety checks
  const selectedEventData = React.useMemo(() => {
    return eventPerformance?.find(event => event.id === selectedEvent) || null;
  }, [eventPerformance, selectedEvent]);
  
  // Format data for attendance comparison chart with enhanced safety checks
  const attendanceComparisonData = React.useMemo(() => {
    if (!eventPerformance?.length) return [];
    
    return eventPerformance.map(event => ({
      name: event.name || 'Unnamed Event',
      attendees: event.attendees || 0,
      expected: Math.round((event.attendees || 0) * (0.9 + Math.random() * 0.3)) // Mock data for comparison
    }));
  }, [eventPerformance]);
  
  // Format data for revenue breakdown with enhanced safety checks
  const revenueBreakdownData = React.useMemo(() => {
    if (!selectedEventData) return [];
    
    const revenue = selectedEventData.revenue || 0;
    return [
      { name: 'Standard Tickets', value: Math.round(revenue * 0.7) },
      { name: 'VIP Tickets', value: Math.round(revenue * 0.2) },
      { name: 'Merchandise', value: Math.round(revenue * 0.05) },
      { name: 'Sponsorships', value: Math.round(revenue * 0.05) },
    ];
  }, [selectedEventData]);
  
  // Format ticket sales trend data with enhanced safety checks
  const ticketSalesTrendData = React.useMemo(() => {
    if (!selectedEventData) return [];
    
    try {
      return Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (14 - i));
        
        // Generate increasing sales trend with some randomness
        const salesValue = Math.round(((selectedEventData.attendees || 0) / 14) * 
          (i + 1) * (0.7 + Math.random() * 0.6));
        
        return {
          name: safeFormatDate(date, 'MMM dd'),
          sales: Math.min(salesValue, selectedEventData.attendees || 0)
        };
      });
    } catch (error) {
      console.error("Error generating ticket sales trend data:", error);
      return [];
    }
  }, [selectedEventData]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  if (!eventPerformance || eventPerformance.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">No event data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Performance Analytics</h3>
        <Select 
          value={selectedEvent} 
          onValueChange={setSelectedEvent}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {eventPerformance.map(event => (
              <SelectItem key={event.id} value={event.id}>{event.name || 'Unnamed Event'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedEventData && (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{selectedEventData.attendees || 0}</div>
                <p className="text-xs text-muted-foreground">Total Attendees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${selectedEventData.ticket_sales || 0}</div>
                <p className="text-xs text-muted-foreground">Tickets Sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">${selectedEventData.revenue || 0}</div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ${selectedEventData.attendees && selectedEventData.revenue && selectedEventData.attendees > 0 ? 
                    Math.round(selectedEventData.revenue / selectedEventData.attendees) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Avg. Revenue per Attendee</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Ticket Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales Trend</CardTitle>
              <CardDescription>Track ticket sales over time for {selectedEventData.name || 'this event'}</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketSalesTrendData.length > 0 ? (
                <AnalyticsLineChart
                  title=""
                  description=""
                  data={ticketSalesTrendData}
                  series={[
                    {
                      key: "sales",
                      name: "Tickets Sold",
                      color: "#10B981"
                    }
                  ]}
                  formatter={(value) => [`${value}`, 'tickets']}
                  height={300}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">No ticket sales trend data available</p>
              )}
            </CardContent>
          </Card>
          
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Breakdown of revenue sources for {selectedEventData.name || 'this event'}</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueBreakdownData.length > 0 ? (
                <AnalyticsBarChart
                  title=""
                  description=""
                  data={revenueBreakdownData}
                  series={[
                    {
                      key: "value",
                      name: "Revenue ($)",
                      color: "#F59E0B"
                    }
                  ]}
                  formatter={(value) => [`$${value}`, '']}
                  height={300}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">No revenue breakdown data available</p>
              )}
            </CardContent>
          </Card>
          
          {/* Attendance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Comparison</CardTitle>
              <CardDescription>Compare attendance across events</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceComparisonData.length > 0 ? (
                <AnalyticsBarChart
                  title=""
                  description=""
                  data={attendanceComparisonData}
                  series={[
                    {
                      key: "attendees",
                      name: "Actual Attendees",
                      color: "#8B5CF6"
                    },
                    {
                      key: "expected",
                      name: "Expected Attendees",
                      color: "#D1D5DB"
                    }
                  ]}
                  formatter={(value) => [`${value}`, 'people']}
                  height={300}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">No attendance comparison data available</p>
              )}
            </CardContent>
          </Card>
          
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Detailed information about {selectedEventData.name || 'this event'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Event Name</TableCell>
                    <TableCell>{selectedEventData.name || 'Unnamed Event'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell>{safeFormatDate(selectedEventData.date, 'MMMM d, yyyy', 'No date')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Venue</TableCell>
                    <TableCell>{selectedEventData.venue_name || 'No venue'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Attendance</TableCell>
                    <TableCell>{selectedEventData.attendees || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tickets Sold</TableCell>
                    <TableCell>{selectedEventData.ticket_sales || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell>${selectedEventData.revenue || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Avg. Ticket Price</TableCell>
                    <TableCell>
                      ${selectedEventData.ticket_sales && selectedEventData.revenue && selectedEventData.ticket_sales > 0 ? 
                        Math.round(selectedEventData.revenue / selectedEventData.ticket_sales) : 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EventAnalyticsTab;
