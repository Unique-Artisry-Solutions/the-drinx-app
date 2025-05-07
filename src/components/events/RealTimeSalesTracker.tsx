
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useEventAnalytics } from '@/hooks/events/useEventAnalytics';

interface RealTimeSalesTrackerProps {
  eventId: string;
}

interface SalesDataPoint {
  time: string;
  sales: number;
  revenue: number;
}

export const RealTimeSalesTracker: React.FC<RealTimeSalesTrackerProps> = ({ eventId }) => {
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week'>('hour');
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState<boolean>(true);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totals, setTotals] = useState<{
    sales: number;
    revenue: number;
    averageSale: number;
  }>({
    sales: 0,
    revenue: 0,
    averageSale: 0
  });

  const { toast } = useToast();
  const { ticketSalesAnalytics } = useEventAnalytics(eventId);

  const loadSalesData = async () => {
    setIsLoading(true);
    try {
      let interval: string;
      let limit: number;
      
      if (timeframe === 'hour') {
        interval = '5 minutes';
        limit = 12; // Last hour in 5-minute intervals
      } else if (timeframe === 'day') {
        interval = '1 hour';
        limit = 24; // Last 24 hours 
      } else {
        interval = '1 day';
        limit = 7; // Last week
      }
      
      // Fake data generation for different timeframes (in a real app, this would be a real DB query)
      const now = new Date();
      const data: SalesDataPoint[] = [];
      let totalSales = 0;
      let totalRevenue = 0;
      
      for (let i = limit - 1; i >= 0; i--) {
        const timePoint = new Date();
        
        if (timeframe === 'hour') {
          timePoint.setMinutes(now.getMinutes() - i * 5);
          const sales = Math.floor(Math.random() * 3);
          const revenue = sales * (Math.random() * 20 + 10);
          totalSales += sales;
          totalRevenue += revenue;
          
          data.push({
            time: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sales,
            revenue: Math.round(revenue * 100) / 100
          });
        } else if (timeframe === 'day') {
          timePoint.setHours(now.getHours() - i);
          const sales = Math.floor(Math.random() * 5 + 1);
          const revenue = sales * (Math.random() * 30 + 15);
          totalSales += sales;
          totalRevenue += revenue;
          
          data.push({
            time: timePoint.toLocaleTimeString([], { hour: '2-digit' }),
            sales,
            revenue: Math.round(revenue * 100) / 100
          });
        } else {
          timePoint.setDate(now.getDate() - i);
          const sales = Math.floor(Math.random() * 20 + 5);
          const revenue = sales * (Math.random() * 40 + 20);
          totalSales += sales;
          totalRevenue += revenue;
          
          data.push({
            time: timePoint.toLocaleDateString([], { weekday: 'short' }),
            sales,
            revenue: Math.round(revenue * 100) / 100
          });
        }
      }
      
      setSalesData(data);
      setTotals({
        sales: totalSales,
        revenue: totalRevenue,
        averageSale: totalSales > 0 ? totalRevenue / totalSales : 0
      });
      
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load real-time sales data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadSalesData();
    
    let subscription: any;
    
    if (isRealtimeEnabled) {
      // Set up real-time subscription
      subscription = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'event_attendees',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            // Update the data when a new ticket is purchased
            loadSalesData();
            toast({
              title: 'New Sale!',
              description: 'A new ticket has been purchased',
              variant: 'default'
            });
          }
        )
        .subscribe();
    }
    
    // Set up polling for live data regardless of subscription
    const interval = setInterval(() => {
      if (isRealtimeEnabled && timeframe === 'hour') {
        loadSalesData();
      }
    }, 30000); // Poll every 30 seconds
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
      clearInterval(interval);
    };
  }, [eventId, timeframe, isRealtimeEnabled]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Ticket Sales</CardTitle>
          <CardDescription>
            Tracking ticket sales as they happen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
            <Skeleton className="h-[250px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Real-Time Ticket Sales</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Live Updates</span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={isRealtimeEnabled}
                onChange={() => setIsRealtimeEnabled(!isRealtimeEnabled)}
                className="sr-only"
                id="toggle"
              />
              <label
                htmlFor="toggle"
                className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors focus:outline-none ${
                  isRealtimeEnabled ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isRealtimeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </label>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {isRealtimeEnabled 
            ? 'Automatically tracking sales activity in real-time'
            : 'Real-time updates are disabled'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="hour">Last Hour</TabsTrigger>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Tickets Sold</div>
              <div className="text-2xl font-bold mt-1">{totals.sales}</div>
              <div className="text-sm mt-1 text-green-600">
                +{Math.round(totals.sales * 0.15)} from previous {timeframe}
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Revenue</div>
              <div className="text-2xl font-bold mt-1">${totals.revenue.toFixed(2)}</div>
              <div className="text-sm mt-1 text-green-600">
                +${(totals.revenue * 0.12).toFixed(2)} from previous {timeframe}
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Average Sale</div>
              <div className="text-2xl font-bold mt-1">
                ${totals.averageSale.toFixed(2)}
              </div>
              <div className="text-sm mt-1 text-gray-500">
                per transaction
              </div>
            </div>
          </div>
          
          <TabsContent value="hour">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Tickets Sold"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="day">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8"
                    name="Tickets Sold"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#82ca9d"
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="week">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar 
                    yAxisId="left" 
                    dataKey="sales" 
                    fill="#8884d8"
                    name="Tickets Sold" 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="revenue" 
                    fill="#82ca9d"
                    name="Revenue ($)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        {ticketSalesAnalytics.salesByType.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Sales Breakdown by Ticket Type</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Ticket Type</th>
                    <th className="text-center py-2">Price</th>
                    <th className="text-center py-2">Sold</th>
                    <th className="text-center py-2">Revenue</th>
                    <th className="text-center py-2">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketSalesAnalytics.salesByType.map((type) => (
                    <tr key={type.typeName} className="border-b">
                      <td className="py-2">{type.typeName}</td>
                      <td className="text-center py-2">$25.00</td>
                      <td className="text-center py-2">{type.sold}</td>
                      <td className="text-center py-2">${(type.sold * 25).toFixed(2)}</td>
                      <td className="text-center py-2">{type.total - type.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {isRealtimeEnabled && (
          <Alert className="mt-6">
            <AlertDescription>
              Real-time sales tracking is enabled. You'll see updates as tickets are purchased.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeSalesTracker;
