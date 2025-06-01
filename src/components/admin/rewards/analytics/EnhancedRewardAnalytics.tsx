
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, FileBarChart2, FileDown, FilterX, Users } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, FunnelChart, Funnel, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { DateRange } from 'react-day-picker';
import { format, subDays, addDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAnalyticsExport } from "@/hooks/useAnalyticsExport";
import { supabase } from '@/lib/supabase';

// Interface for funnel data
interface FunnelStageData {
  name: string;
  value: number;
  fill?: string;
  dropOffRate?: number;
}

// Interface for cohort data
interface CohortData {
  cohort: string;
  users: number;
  retention: Record<string, number>;
}

// Interface for segment data
interface SegmentData {
  name: string;
  users: number;
  engagementRate: number;
  conversionRate: number;
  value: number;
}

export function EnhancedRewardAnalytics() {
  const { toast } = useToast();
  const { exportAnalytics, isExporting } = useAnalyticsExport();
  const [activeTab, setActiveTab] = useState('funnel');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [timeFrame, setTimeFrame] = useState('30d');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [funnelData, setFunnelData] = useState<FunnelStageData[]>([]);
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [segmentData, setSegmentData] = useState<SegmentData[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [dropoffData, setDropoffData] = useState<any[]>([]);

  // Colors for charts
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
  const FUNNEL_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeFrame, dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch funnel data
      const funnelResult = await fetchFunnelData();
      setFunnelData(funnelResult);

      // Fetch cohort data
      const cohortResult = await fetchCohortData();
      setCohortData(cohortResult);

      // Fetch segment data
      const segmentResult = await fetchSegmentData();
      setSegmentData(segmentResult);

      // Fetch conversion data
      const conversionResult = await fetchConversionData();
      setConversionData(conversionResult);

      // Fetch dropoff data
      const dropoffResult = await fetchDropoffData();
      setDropoffData(dropoffResult);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reward funnel data
  const fetchFunnelData = async (): Promise<FunnelStageData[]> => {
    // In a real implementation, this would fetch actual data from your analytics database
    // For now, we'll use simulated data
    
    // This would typically be a query to your analytics_events table or a specialized view
    /* Example query:
    const { data, error } = await supabase
      .from('reward_funnel_data')
      .select('stage, count')
      .gte('timestamp', dateRange.from?.toISOString())
      .lte('timestamp', dateRange.to?.toISOString());
    */
    
    // Simulate funnel data
    const data = [
      { name: 'Discovery', value: 1000, fill: FUNNEL_COLORS[0] },
      { name: 'Enrollment', value: 750, fill: FUNNEL_COLORS[1], dropOffRate: 25 },
      { name: 'First Earn', value: 500, fill: FUNNEL_COLORS[2], dropOffRate: 33.3 },
      { name: 'Repeat Earn', value: 350, fill: FUNNEL_COLORS[3], dropOffRate: 30 },
      { name: 'Redemption Browse', value: 200, fill: FUNNEL_COLORS[4], dropOffRate: 42.9 },
      { name: 'Redemption', value: 100, fill: FUNNEL_COLORS[5], dropOffRate: 50 },
    ];
    
    return data;
  };

  // Fetch cohort analysis data
  const fetchCohortData = async (): Promise<CohortData[]> => {
    // In a real implementation, this would fetch actual cohort data
    // Example query would use analytics_events grouped by cohort (signup month) and time periods
    
    // Simulate cohort data
    return [
      { 
        cohort: 'Jan 2025', 
        users: 120, 
        retention: { 'Week 1': 100, 'Week 2': 85, 'Week 3': 72, 'Week 4': 65 } 
      },
      { 
        cohort: 'Feb 2025', 
        users: 150, 
        retention: { 'Week 1': 100, 'Week 2': 80, 'Week 3': 68, 'Week 4': 60 } 
      },
      { 
        cohort: 'Mar 2025', 
        users: 200, 
        retention: { 'Week 1': 100, 'Week 2': 78, 'Week 3': 65, 'Week 4': 58 } 
      },
      { 
        cohort: 'Apr 2025', 
        users: 180, 
        retention: { 'Week 1': 100, 'Week 2': 82, 'Week 3': 70, 'Week 4': 63 } 
      },
    ];
  };

  // Fetch segment data
  const fetchSegmentData = async (): Promise<SegmentData[]> => {
    // Simulate segment data
    return [
      { name: 'New Users', users: 520, engagementRate: 25, conversionRate: 12, value: 520 },
      { name: 'Casual', users: 350, engagementRate: 45, conversionRate: 18, value: 350 },
      { name: 'Regular', users: 250, engagementRate: 65, conversionRate: 32, value: 250 },
      { name: 'Loyal', users: 180, engagementRate: 85, conversionRate: 65, value: 180 },
      { name: 'VIP', users: 50, engagementRate: 95, conversionRate: 80, value: 50 },
    ];
  };

  // Fetch conversion data
  const fetchConversionData = async (): Promise<any[]> => {
    // Simulate conversion tracking data between stages
    return [
      { month: 'Jan', discovery_to_enrollment: 75, enrollment_to_first_earn: 65, first_earn_to_redemption: 45 },
      { month: 'Feb', discovery_to_enrollment: 78, enrollment_to_first_earn: 68, first_earn_to_redemption: 48 },
      { month: 'Mar', discovery_to_enrollment: 72, enrollment_to_first_earn: 64, first_earn_to_redemption: 42 },
      { month: 'Apr', discovery_to_enrollment: 80, enrollment_to_first_earn: 70, first_earn_to_redemption: 50 },
    ];
  };

  // Fetch dropoff data
  const fetchDropoffData = async (): Promise<any[]> => {
    // Simulate dropoff analysis data
    return [
      { name: 'Before Sign-up', value: 25, reason: 'Complex registration form' },
      { name: 'After Enrollment', value: 35, reason: 'No clear instructions' },
      { name: 'Before First Earn', value: 40, reason: 'Value proposition unclear' },
      { name: 'Before Redemption', value: 45, reason: 'High point requirements' },
      { name: 'After First Redemption', value: 20, reason: 'Poor reward quality' },
    ];
  };

  const handleExport = async () => {
    try {
      const exportData = {
        funnelData,
        cohortData,
        segmentData,
        conversionData,
        dropoffData,
        dateRange: {
          from: dateRange?.from?.toISOString(),
          to: dateRange?.to?.toISOString()
        },
        exportDate: new Date().toISOString()
      };
      
      await exportAnalytics(exportData, 'reward_enhanced_analytics');
      toast({
        title: "Export Successful",
        description: "Analytics data has been exported successfully",
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the analytics data.',
        variant: 'destructive',
      });
    }
  };

  // Prepare cohort table data for visualization
  const preparedCohortData = () => {
    return cohortData.map(cohort => {
      return {
        cohort: cohort.cohort,
        'Week 1': cohort.retention['Week 1'],
        'Week 2': cohort.retention['Week 2'],
        'Week 3': cohort.retention['Week 3'],
        'Week 4': cohort.retention['Week 4'],
      };
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Enhanced Reward Analytics</CardTitle>
          <CardDescription>
            Detailed analytics for user engagement and reward program performance
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <FileDown className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="segments">User Segments</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Tracking</TabsTrigger>
            <TabsTrigger value="dropoff">Drop-off Analysis</TabsTrigger>
          </TabsList>

          {/* Funnel Visualization Tab */}
          <TabsContent value="funnel" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reward Program Funnel</CardTitle>
                  <CardDescription>Visualization of user progression through the rewards program</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} users (${props.payload.dropOffRate ? props.payload.dropOffRate + '% drop' : 'starting point'})`,
                            name
                          ]} 
                        />
                        <Funnel
                          dataKey="value"
                          data={funnelData}
                          isAnimationActive
                        >
                          <LabelList
                            position="right"
                            fill="#000"
                            stroke="none"
                            dataKey="name"
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stage Completion</CardTitle>
                  <CardDescription>User counts and drop-off rates at each stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {funnelData.map((stage, index) => (
                      <div key={stage.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{stage.name}</span>
                          <span className="text-sm">{stage.value} users</span>
                        </div>
                        <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                          <div 
                            className="h-full"
                            style={{
                              width: `${(stage.value / funnelData[0].value) * 100}%`,
                              backgroundColor: stage.fill
                            }}
                          />
                        </div>
                        {index > 0 && (
                          <div className="text-xs text-muted-foreground text-right">
                            Drop-off from previous: {stage.dropOffRate}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cohort Analysis Tab */}
          <TabsContent value="cohorts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cohort Retention Analysis</CardTitle>
                <CardDescription>User retention based on signup date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={preparedCohortData()}
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis dataKey="cohort" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                      <Legend />
                      <Bar dataKey="Week 1" fill="#8884d8" name="Week 1" />
                      <Bar dataKey="Week 2" fill="#83a6ed" name="Week 2" />
                      <Bar dataKey="Week 3" fill="#8dd1e1" name="Week 3" />
                      <Bar dataKey="Week 4" fill="#82ca9d" name="Week 4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <div className="overflow-x-auto bg-card rounded-md border">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Cohort</th>
                    <th className="px-4 py-3 text-left">Users</th>
                    <th className="px-4 py-3 text-left">Week 1</th>
                    <th className="px-4 py-3 text-left">Week 2</th>
                    <th className="px-4 py-3 text-left">Week 3</th>
                    <th className="px-4 py-3 text-left">Week 4</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b">
                      <td className="px-4 py-3">{cohort.cohort}</td>
                      <td className="px-4 py-3">{cohort.users}</td>
                      <td className="px-4 py-3">{cohort.retention['Week 1']}%</td>
                      <td className="px-4 py-3">{cohort.retention['Week 2']}%</td>
                      <td className="px-4 py-3">{cohort.retention['Week 3']}%</td>
                      <td className="px-4 py-3">{cohort.retention['Week 4']}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Behavior-Based Segmentation</CardTitle>
                  <CardDescription>User segments based on engagement patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="users"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {segmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Users']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Segment Engagement & Conversion</CardTitle>
                  <CardDescription>Comparison of engagement and conversion rates by segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={segmentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip formatter={(value) => [`${value}%`, '']} />
                        <Legend />
                        <Bar dataKey="engagementRate" fill="#8884d8" name="Engagement Rate" />
                        <Bar dataKey="conversionRate" fill="#82ca9d" name="Conversion Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Segment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Segment</th>
                        <th className="px-4 py-3 text-left">Users</th>
                        <th className="px-4 py-3 text-left">Engagement Rate</th>
                        <th className="px-4 py-3 text-left">Conversion Rate</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.map((segment) => (
                        <tr key={segment.name} className="border-b">
                          <td className="px-4 py-3 font-medium">{segment.name}</td>
                          <td className="px-4 py-3">{segment.users}</td>
                          <td className="px-4 py-3">{segment.engagementRate}%</td>
                          <td className="px-4 py-3">{segment.conversionRate}%</td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Tracking Tab */}
          <TabsContent value="conversion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stage Conversion Rates</CardTitle>
                <CardDescription>Tracking conversion between reward program stages over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="discovery_to_enrollment" 
                        name="Discovery to Enrollment" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="enrollment_to_first_earn" 
                        name="Enrollment to First Earn" 
                        stroke="#82ca9d" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="first_earn_to_redemption" 
                        name="First Earn to Redemption" 
                        stroke="#ffc658" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Conversion Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Discovery → Enrollment</h3>
                      <div className="flex items-center mt-1">
                        <div className="font-bold text-2xl">75%</div>
                        <div className="text-emerald-500 ml-2 text-sm">↑ 2.1%</div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">From last period</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Enrollment → First Earn</h3>
                      <div className="flex items-center mt-1">
                        <div className="font-bold text-2xl">68%</div>
                        <div className="text-red-500 ml-2 text-sm">↓ 1.3%</div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">From last period</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">First Earn → Redemption</h3>
                      <div className="flex items-center mt-1">
                        <div className="font-bold text-2xl">45%</div>
                        <div className="text-emerald-500 ml-2 text-sm">↑ 3.8%</div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">From last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Conversion Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Highest Converting Path</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="bg-primary/20 px-2 py-1 rounded">App Install</div>
                        <span>→</span>
                        <div className="bg-primary/20 px-2 py-1 rounded">Discovery</div>
                        <span>→</span>
                        <div className="bg-primary/20 px-2 py-1 rounded">Signup</div>
                        <span>→</span>
                        <div className="bg-primary/20 px-2 py-1 rounded">First Visit</div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Users following this path have an 82% conversion rate to program enrollment
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Lowest Converting Path</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="bg-primary/20 px-2 py-1 rounded">Social Media</div>
                        <span>→</span>
                        <div className="bg-primary/20 px-2 py-1 rounded">Discovery</div>
                        <span>→</span>
                        <div className="bg-primary/20 px-2 py-1 rounded">Leave</div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Users from social media have only a 23% conversion rate to program enrollment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drop-off Analysis Tab */}
          <TabsContent value="dropoff" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Drop-off Points</CardTitle>
                  <CardDescription>Identifying key friction points in the user journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dropoffData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" unit="%" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`${value}% drop-off`, '']} />
                        <Legend />
                        <Bar dataKey="value" fill="#ff8042" name="Drop-off Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Primary Drop-off Reasons</CardTitle>
                  <CardDescription>Identified friction points and their impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {dropoffData.map((point) => (
                      <div key={point.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{point.name}</h4>
                            <p className="text-sm text-muted-foreground">{point.reason}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold">{point.value}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                          <div 
                            className="h-full bg-orange-500"
                            style={{ width: `${point.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Registration Optimization</h3>
                    <p className="text-sm text-muted-foreground">Simplify the registration process by reducing required fields and adding social sign-up options.</p>
                    <Button variant="link" className="px-0 mt-2">View Details</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Improve First-Time UX</h3>
                    <p className="text-sm text-muted-foreground">Add interactive onboarding and clearer instructions for new users to increase engagement.</p>
                    <Button variant="link" className="px-0 mt-2">View Details</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Redemption Threshold</h3>
                    <p className="text-sm text-muted-foreground">Consider lowering initial point requirements for rewards to encourage first redemption.</p>
                    <Button variant="link" className="px-0 mt-2">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
