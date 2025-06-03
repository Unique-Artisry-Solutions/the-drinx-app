
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, TicketCheck, DollarSign } from 'lucide-react';
// import { Share2, CalendarDays } from 'lucide-react'; // Commented out to preserve future functionality

interface AnalyticsData {
  totalAttendees: number;
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
}

interface AnalyticsDashboardProps {
  // eventId: string; // Commented out to preserve future functionality
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  // eventId, // Commented out to preserve future functionality
  data 
}) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAttendees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <TicketCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ticketsSold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversionRate}%</div>
            <Badge variant="secondary" className="mt-1">
              Good
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your event is performing well with {data.totalAttendees} confirmed attendees 
                and a {data.conversionRate}% conversion rate.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed attendee breakdown and demographics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Revenue breakdown and sales trends will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
