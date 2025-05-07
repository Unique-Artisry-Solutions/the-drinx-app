import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { EventAttendee } from '@/types/EventTypes';
import { useEventAnalytics } from '@/hooks/events/useEventAnalytics';

interface AttendanceAnalyticsProps {
  eventId: string;
  attendees: EventAttendee[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ 
  eventId, 
  attendees,
  isLoading = false
}) => {
  const { ticketSalesAnalytics } = useEventAnalytics(eventId);
  
  // Compute attendance rates
  const attendanceStats = React.useMemo(() => {
    const total = attendees.length;
    const checkedIn = attendees.filter(a => a.status === 'checked_in').length;
    const noShow = attendees.filter(a => a.status === 'no_show').length;
    const cancelled = attendees.filter(a => a.status === 'cancelled').length;
    const registered = attendees.filter(a => a.status === 'registered').length;
    
    return {
      total,
      checkedIn,
      noShow,
      cancelled,
      registered,
      attendanceRate: total > 0 ? (checkedIn / total) * 100 : 0
    };
  }, [attendees]);
  
  // Compute check-in times
  const checkInTimes = React.useMemo(() => {
    const timeMap = new Map<string, number>();
    
    attendees.forEach(attendee => {
      if (attendee.checked_in_at) {
        const hour = new Date(attendee.checked_in_at).getHours();
        const timeKey = `${hour}:00`;
        
        const count = timeMap.get(timeKey) || 0;
        timeMap.set(timeKey, count + 1);
      }
    });
    
    // Convert to array and sort by hour
    return Array.from(timeMap.entries())
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => {
        const hourA = parseInt(a.time.split(':')[0], 10);
        const hourB = parseInt(b.time.split(':')[0], 10);
        return hourA - hourB;
      });
  }, [attendees]);
  
  // Prepare data for pie chart
  const statusData = [
    { name: 'Checked In', value: attendanceStats.checkedIn },
    { name: 'Not Checked In', value: attendanceStats.registered },
    { name: 'Cancelled', value: attendanceStats.cancelled },
    { name: 'No Show', value: attendanceStats.noShow },
  ].filter(item => item.value > 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
          <CardDescription>Loading attendance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Analytics</CardTitle>
        <CardDescription>
          {attendanceStats.total === 0 
            ? 'No attendance data available yet' 
            : `${attendanceStats.checkedIn} of ${attendanceStats.total} attendees checked in (${Math.round(attendanceStats.attendanceRate)}%)`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="check-ins">Check-in Times</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Attendees</div>
                <div className="text-2xl font-bold">{attendanceStats.total}</div>
                <div className="text-sm text-gray-500 mt-1">Registered</div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Checked In</div>
                <div className="text-2xl font-bold">{attendanceStats.checkedIn}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(attendanceStats.attendanceRate)}% attendance rate
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">No Shows</div>
                <div className="text-2xl font-bold">
                  {attendanceStats.noShow + attendanceStats.registered}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round(
                    ((attendanceStats.noShow + attendanceStats.registered) / 
                    (attendanceStats.total > 0 ? attendanceStats.total : 1)) * 100
                  )}% no-show rate
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Attendee Status</h3>
                <div className="h-[250px]">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No attendance data available</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Ticket Type Attendance</h3>
                <div className="space-y-4">
                  {ticketSalesAnalytics.salesByType.map((ticketType) => {
                    const checkedIn = Math.round(ticketType.sold * (attendanceStats.attendanceRate / 100));
                    const percentage = ticketType.sold > 0 ? (checkedIn / ticketType.sold) * 100 : 0;
                    
                    return (
                      <div key={ticketType.typeName} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{ticketType.typeName}</span>
                          <span>
                            {checkedIn} / {ticketType.sold} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                  
                  {ticketSalesAnalytics.salesByType.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No ticket type data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="check-ins">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Check-in Times</h3>
                <div className="h-[300px]">
                  {checkInTimes.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={checkInTimes}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Check-ins" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">No check-in time data available</p>
                    </div>
                  )}
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Check-in Rate Over Time</CardTitle>
                  <CardDescription>
                    How attendance accumulated during the event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {checkInTimes.length > 0 ? (
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          width={500}
                          height={300}
                          data={checkInTimes.reduce((acc, item, index, array) => {
                            const cumulativeCount = array
                              .slice(0, index + 1)
                              .reduce((sum, i) => sum + i.count, 0);
                            
                            acc.push({
                              time: item.time,
                              count: cumulativeCount,
                              percentage: (cumulativeCount / attendanceStats.checkedIn) * 100
                            });
                            
                            return acc;
                          }, [] as any[])}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="count" 
                            name="Total Checked In" 
                            stroke="#8884d8" />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="percentage" 
                            name="Percentage (%)" 
                            stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-gray-400">No check-in data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">Demographic Analytics</h3>
              <p className="text-gray-400">
                Collect demographic data during registration to enable detailed demographic analytics.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceAnalytics;
