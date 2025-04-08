import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEstablishmentAnalytics } from '@/hooks/useEstablishmentAnalytics';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Download, RefreshCw } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EstablishmentAnalyticsPage = () => {
  const { user } = useAuth();
  const { id: urlEstablishmentId } = useParams<{ id: string }>();
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [isEstablishmentLoading, setIsEstablishmentLoading] = useState(true);
  const [establishmentError, setEstablishmentError] = useState<string | null>(null);
  const [establishmentName, setEstablishmentName] = useState<string>('');
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  
  // Fetch the establishment ID from URL or user profile
  useEffect(() => {
    const fetchEstablishment = async () => {
      setIsEstablishmentLoading(true);
      setEstablishmentError(null);

      try {
        // If establishment ID is provided in URL, use that
        if (urlEstablishmentId) {
          // Verify the establishment exists
          const { data, error } = await supabase
            .from('establishments')
            .select('id, name')
            .eq('id', urlEstablishmentId)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setEstablishmentId(data.id);
            setEstablishmentName(data.name);
          } else {
            throw new Error('Establishment not found');
          }
        } 
        // Otherwise try to get the user's establishment ID
        else if (user) {
          const { data, error } = await supabase
            .from('establishments')
            .select('id, name')
            .eq('owner_id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setEstablishmentId(data.id);
            setEstablishmentName(data.name);
          } else {
            throw new Error('No establishment found for this user');
          }
        } else {
          throw new Error('No establishment specified');
        }
      } catch (err: any) {
        console.error('Error fetching establishment:', err);
        setEstablishmentError(err.message || 'Failed to load establishment');
      } finally {
        setIsEstablishmentLoading(false);
      }
    };
    
    fetchEstablishment();
  }, [urlEstablishmentId, user]);
  
  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData,
    barCrawlData,
    isLoading: isDashboardLoading 
  } = useDashboardData();

  // Use our analytics hook with the date range
  const {
    visitorAnalytics,
    visitorTrends,
    retentionTrends,
    revenueReports,
    popularDrinks,
    isLoading: isAnalyticsLoading,
    error: analyticsError
  } = useEstablishmentAnalytics({
    establishmentId: establishmentId || '',
    range: {
      startDate: date?.from || addDays(new Date(), -30),
      endDate: date?.to || new Date()
    }
  });

  // Format visitor data for charts
  const formattedVisitorData = React.useMemo(() => {
    return visitorAnalytics.map(data => ({
      name: format(new Date(data.date), 'MMM d'),
      visitors: data.total_visitors,
      returningVisitors: data.returning_visitors,
      uniqueVisitors: data.unique_visitors,
      date: data.date
    }));
  }, [visitorAnalytics]);

  // Format revenue data for charts
  const formattedRevenueData = React.useMemo(() => {
    return revenueReports.map(report => ({
      name: format(new Date(report.month), 'MMM yyyy'),
      revenue: report.monthly_revenue,
      transactions: report.transaction_count
    }));
  }, [revenueReports]);

  // Download analytics as CSV
  const downloadAnalyticsCSV = () => {
    // Combine all data
    const allData = {
      visitors: formattedVisitorData,
      revenue: formattedRevenueData,
      drinks: popularDrinks
    };
    
    // Convert to CSV
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "Date,Total Visitors,Returning Visitors,Unique Visitors\n" +
      formattedVisitorData.map(row => 
        `${row.date},${row.visitors},${row.returningVisitors},${row.uniqueVisitors}`
      ).join("\n");
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isEstablishmentLoading || isAnalyticsLoading || isDashboardLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (establishmentError || analyticsError) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Analytics</AlertTitle>
            <AlertDescription>{establishmentError || analyticsError}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto p-6 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            {establishmentName ? `${establishmentName} - Analytics` : 'Establishment Analytics'}
          </h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={downloadAnalyticsCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full mb-10">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Visitor Growth</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedVisitorData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="visitors" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="uniqueVisitors" 
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Ratings Overview</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} domain={[0, 5]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rating" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Popular Mocktails</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={popularDrinks.slice(0, 5).map(drink => ({
                          name: drink.cocktail_name.length > 15 
                            ? `${drink.cocktail_name.substring(0, 13)}...` 
                            : drink.cocktail_name,
                          reviews: drink.review_count,
                          rating: drink.average_rating,
                          fullName: drink.cocktail_name
                        }))}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{fontSize: 12}} />
                        <YAxis type="category" dataKey="name" tick={{fontSize: 12}} width={120} />
                        <Tooltip 
                          labelFormatter={(label) => {
                            const drink = popularDrinks.find(d => d.cocktail_name.includes(label));
                            return drink ? drink.cocktail_name : label;
                          }}
                        />
                        <Legend />
                        <Bar dataKey="reviews" fill="#82ca9d" name="Reviews" />
                        <Bar dataKey="rating" fill="#8884d8" name="Rating" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={formattedRevenueData} 
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                        <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="visitors" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Visitor Demographics - Age</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <Pie
                          data={mockAgeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockAgeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Visitor Demographics - Gender</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <Pie
                          data={mockGenderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockGenderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Returning Visitor Rate</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formattedVisitorData}
                      margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
                      <YAxis 
                        tick={{fontSize: 12}} 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, 'Return Rate']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="returningVisitors"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formattedRevenueData}
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis 
                          tick={{fontSize: 12}} 
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Transactions Count</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formattedRevenueData}
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="transactions"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Popular Drinks by Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <Pie
                        data={popularDrinks.slice(0, 5).map((drink, index) => ({
                          name: drink.cocktail_name,
                          value: (drink.review_count * (5 - index)) // Simple simulation of revenue
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${value}`}
                      >
                        {popularDrinks.slice(0, 5).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Review Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <Pie
                          data={[
                            { name: 'Positive', value: 65 },
                            { name: 'Neutral', value: 25 },
                            { name: 'Negative', value: 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#4ade80" />
                          <Cell fill="#facc15" />
                          <Cell fill="#f87171" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Social Media Engagement</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Instagram', value: 320 },
                          { name: 'Facebook', value: 210 },
                          { name: 'Twitter', value: 170 },
                          { name: 'TikTok', value: 150 }
                        ]}
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Engagements">
                          {[
                            <Cell key="0" fill="#E1306C" />, // Instagram
                            <Cell key="1" fill="#4267B2" />, // Facebook
                            <Cell key="2" fill="#1DA1F2" />, // Twitter
                            <Cell key="3" fill="#000000" />  // TikTok
                          ]}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Customer Feedback Categories</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Taste', value: 85 },
                        { name: 'Presentation', value: 78 },
                        { name: 'Service', value: 92 },
                        { name: 'Ambiance', value: 88 },
                        { name: 'Value', value: 72 }
                      ]}
                      margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{fontSize: 12}} domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" tick={{fontSize: 12}} width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Satisfaction']} />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Satisfaction Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentAnalyticsPage;
