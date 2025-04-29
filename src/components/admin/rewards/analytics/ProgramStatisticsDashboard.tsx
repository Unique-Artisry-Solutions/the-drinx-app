
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, FileBarChart2, FileDown, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAnalyticsExport } from "@/hooks/useAnalyticsExport";
import { rewardsApi } from "@/lib/rewards/api";

interface ChartData {
  name: string;
  value: number;
}

interface TimeSeriesData {
  date: string;
  pointsEarned: number;
  pointsRedeemed: number;
  netPoints: number;
}

export function ProgramStatisticsDashboard() {
  const { toast } = useToast();
  const { isExporting, exportAnalytics } = useAnalyticsExport();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPointsEarned: 0,
    totalPointsRedeemed: 0,
    averagePointsPerUser: 0,
    redemptionRate: 0
  });
  
  const [pointsDistribution, setPointsDistribution] = useState<ChartData[]>([]);
  const [activityOverTime, setActivityOverTime] = useState<TimeSeriesData[]>([]);
  const [sourcesBreakdown, setSourcesBreakdown] = useState<ChartData[]>([]);
  
  useEffect(() => {
    loadStatistics();
  }, [timeRange]);
  
  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      // Get reward analytics data
      const data = await rewardsApi.getRewardAnalytics();
      
      // Set metrics
      setMetrics({
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        totalPointsEarned: data.totalPointsEarned || 0,
        totalPointsRedeemed: data.totalPointsRedeemed || 0,
        averagePointsPerUser: data.averagePointsPerUser || 0,
        redemptionRate: data.redemptionRate || 0
      });
      
      // Set time series data
      setActivityOverTime(data.timeSeriesData || []);
      
      // Set points distribution
      if (data.tierDistribution) {
        setPointsDistribution(Object.entries(data.tierDistribution).map(([name, value]) => ({
          name,
          value: value as number
        })));
      }
      
      // Set sources breakdown
      if (data.sourcesBreakdown) {
        setSourcesBreakdown(Object.entries(data.sourcesBreakdown).map(([name, value]) => ({
          name,
          value: value as number
        })));
      }
    } catch (error) {
      console.error("Error loading reward statistics:", error);
      toast({
        title: "Error",
        description: "Failed to load reward program statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async () => {
    try {
      // Prepare data for export
      const exportData = {
        "Total Users": metrics.totalUsers,
        "Active Users": metrics.activeUsers,
        "Total Points Earned": metrics.totalPointsEarned,
        "Total Points Redeemed": metrics.totalPointsRedeemed,
        "Average Points Per User": metrics.averagePointsPerUser,
        "Redemption Rate (%)": metrics.redemptionRate,
        "Time Range": timeRange
      };
      
      // Call the exportAnalytics function
      await exportAnalytics(exportData, "reward_program_statistics");
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the statistics",
        variant: "destructive"
      });
    }
  };
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileBarChart2 className="h-5 w-5 text-primary" />
          Reward Program Statistics
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Points Earned" value={metrics.totalPointsEarned.toLocaleString()} />
              <StatCard title="Total Points Redeemed" value={metrics.totalPointsRedeemed.toLocaleString()} />
              <StatCard title="Redemption Rate" value={`${metrics.redemptionRate.toFixed(1)}%`} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="sources">Point Sources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">User Distribution by Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pointsDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pointsDistribution.map((entry, index) => (
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
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">User Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard title="Total Users" value={metrics.totalUsers.toLocaleString()} variant="small" />
                          <StatCard title="Active Users" value={metrics.activeUsers.toLocaleString()} variant="small" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <StatCard 
                            title="Average Points per User" 
                            value={metrics.averagePointsPerUser.toLocaleString()} 
                            variant="small" 
                          />
                        </div>
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Active Users Distribution</h4>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={pointsDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Points Activity Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="pointsEarned" 
                            name="Points Earned" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="pointsRedeemed" 
                            name="Points Redeemed" 
                            stroke="#82ca9d" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="netPoints" 
                            name="Net Points" 
                            stroke="#ffc658" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sources" className="pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Points by Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sourcesBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" name="Points" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  variant?: 'default' | 'small';
}

function StatCard({ title, value, variant = 'default' }: StatCardProps) {
  return (
    <div className={`bg-muted rounded-lg p-${variant === 'small' ? '3' : '4'} flex flex-col`}>
      <span className={`text-${variant === 'small' ? 'xs' : 'sm'} text-muted-foreground mb-1`}>{title}</span>
      <span className={`font-semibold text-${variant === 'small' ? 'lg' : '2xl'}`}>{value}</span>
    </div>
  );
}
