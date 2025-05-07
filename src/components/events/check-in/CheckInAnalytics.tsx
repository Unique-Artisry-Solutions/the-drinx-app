
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { EventAttendee } from '@/types/EventTypes';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAttendeeCheckInStats } from '@/services/eventAttendeesService';

interface CheckInAnalyticsProps {
  eventId: string;
  attendees: EventAttendee[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const CheckInAnalytics: React.FC<CheckInAnalyticsProps> = ({ eventId, attendees }) => {
  // Compute check-in statistics
  const checkInStats = useMemo(() => {
    return getAttendeeCheckInStats(attendees);
  }, [attendees]);

  // Compute status distribution
  const statusDistribution = useMemo(() => {
    const statusCounts: Record<string, number> = {
      'registered': 0,
      'checked_in': 0,
      'cancelled': 0,
      'no_show': 0
    };

    attendees.forEach(attendee => {
      if (statusCounts[attendee.status] !== undefined) {
        statusCounts[attendee.status]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status === 'registered' ? 'Not Checked In' : 
            status === 'checked_in' ? 'Checked In' : 
            status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count
    }));
  }, [attendees]);

  // Compute hourly check-ins if we have checked in attendees
  const hourlyCheckIns = useMemo(() => {
    const hourCounts: Record<string, number> = {};
    
    attendees.forEach(attendee => {
      if (attendee.checked_in_at) {
        const hour = new Date(attendee.checked_in_at).getHours();
        const hourFormatted = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        
        if (!hourCounts[hourFormatted]) {
          hourCounts[hourFormatted] = 0;
        }
        hourCounts[hourFormatted]++;
      }
    });
    
    // Sort by hour
    return Object.entries(hourCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([hour, count]) => ({
        hour,
        count
      }));
  }, [attendees]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{checkInStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{checkInStats.checkedIn}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Check-In Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {checkInStats.checkInRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Attendee Status</CardTitle>
            <CardDescription>Distribution of attendee status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {hourlyCheckIns.length > 0 && (
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Check-in Times</CardTitle>
              <CardDescription>Check-ins by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlyCheckIns}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Check-ins" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckInAnalytics;
