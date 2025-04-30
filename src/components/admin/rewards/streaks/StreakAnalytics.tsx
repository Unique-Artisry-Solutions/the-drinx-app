
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  AlertCircle,
  Star,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';

interface StreakAnalyticsProps {
  className?: string;
}

interface StreakPerformance {
  streak_type: string;
  total_streaks: number;
  avg_current_streak_length: number;
  max_streak_length: number;
  streaks_3_plus: number;
  streaks_7_plus: number;
  streaks_30_plus: number;
}

interface StreakDistribution {
  name: string;
  value: number;
}

interface StreakSetting {
  id: string;
  name: string;
  streak_type: string;
  description: string | null;
}

const StreakAnalytics: React.FC<StreakAnalyticsProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [performance, setPerformance] = useState<StreakPerformance[]>([]);
  const [settings, setSettings] = useState<StreakSetting[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch streak performance data
        const { data: performanceData, error: performanceError } = await supabase
          .from('streak_performance')
          .select('*');
  
        if (performanceError) throw performanceError;
        
        // Fetch streak settings for name mapping
        const { data: settingsData, error: settingsError } = await supabase
          .from('streak_settings')
          .select('id, name, streak_type, description')
          .is('establishment_id', null);
          
        if (settingsError) throw settingsError;
        
        setPerformance(performanceData || []);
        setSettings(settingsData || []);
      } catch (error) {
        console.error('Error fetching streak analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get friendly name for streak type
  const getStreakName = (streakType: string) => {
    const setting = settings.find(s => s.streak_type === streakType);
    return setting ? setting.name : streakType;
  };
  
  // Generate streak distribution data for pie chart
  const generateStreakDistribution = (streakType: string): StreakDistribution[] => {
    const data = performance.find(p => p.streak_type === streakType);
    if (!data) return [];
    
    return [
      { name: '1-2 days', value: data.total_streaks - data.streaks_3_plus },
      { name: '3-6 days', value: data.streaks_3_plus - data.streaks_7_plus },
      { name: '7-29 days', value: data.streaks_7_plus - data.streaks_30_plus },
      { name: '30+ days', value: data.streaks_30_plus }
    ];
  };

  // Prepare data for the bar chart
  const getAverageStreakData = () => {
    return performance.map(p => ({
      name: getStreakName(p.streak_type),
      avgLength: parseFloat(p.avg_current_streak_length.toFixed(1)),
      maxLength: p.max_streak_length
    }));
  };

  // Calculate overall metrics
  const getTotalUserCount = () => {
    if (!performance.length) return 0;
    return performance.reduce((sum, p) => sum + p.total_streaks, 0);
  };
  
  const getAverageRetention = () => {
    if (!performance.length) return 0;
    const totalRetained = performance.reduce((sum, p) => sum + p.streaks_7_plus, 0);
    const totalUsers = getTotalUserCount();
    return totalUsers > 0 ? Math.round((totalRetained / totalUsers) * 100) : 0;
  };
  
  const getLongestStreak = () => {
    if (!performance.length) return { length: 0, type: '' };
    let maxLength = 0;
    let maxType = '';
    
    performance.forEach(p => {
      if (p.max_streak_length > maxLength) {
        maxLength = p.max_streak_length;
        maxType = p.streak_type;
      }
    });
    
    return { length: maxLength, type: getStreakName(maxType) };
  };

  // Define colors for the pie chart
  const COLORS = ['#e0e0e0', '#bfdbfe', '#93c5fd', '#3b82f6'];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-10 text-center">
          <div className="inline-block animate-spin text-primary">
            <Clock className="h-8 w-8" />
          </div>
          <p className="mt-2">Loading streak analytics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Streak Analytics
        </CardTitle>
        <CardDescription>
          Performance metrics for user streaks across different activity types
        </CardDescription>
      </CardHeader>
      <CardContent>
        {performance.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No streak data available</AlertTitle>
            <AlertDescription>
              There are no active streaks in the system. Streak data will appear once users start building streaks.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {performance.map(p => (
                <TabsTrigger key={p.streak_type} value={p.streak_type}>
                  {getStreakName(p.streak_type)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{getTotalUserCount()}</div>
                    <p className="text-xs text-muted-foreground">Total users with streaks</p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" /> 
                      Across all streak types
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{getAverageRetention()}%</div>
                    <p className="text-xs text-muted-foreground">Week+ retention rate</p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      Users maintaining 7+ day streaks
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{getLongestStreak().length} days</div>
                    <p className="text-xs text-muted-foreground">Longest active streak</p>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                      {getLongestStreak().type}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Average Streak Lengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getAverageStreakData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value, name) => [value, name === 'avgLength' ? 'Avg. Length' : 'Max Length']}
                          labelFormatter={(label) => `Streak: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="avgLength" name="Average Length (days)" fill="#3b82f6" />
                        <Bar dataKey="maxLength" name="Max Length (days)" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {performance.map(streakData => (
              <TabsContent key={streakData.streak_type} value={streakData.streak_type} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{streakData.total_streaks}</div>
                      <p className="text-xs text-muted-foreground">Total users</p>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        Users with {getStreakName(streakData.streak_type)} streaks
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{streakData.avg_current_streak_length.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Average streak length</p>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        Days per user (average)
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{streakData.max_streak_length}</div>
                      <p className="text-xs text-muted-foreground">Longest streak</p>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <Star className="mr-1 h-4 w-4 text-muted-foreground" />
                        Maximum consecutive days
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Streak Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={generateStreakDistribution(streakData.streak_type)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {generateStreakDistribution(streakData.streak_type).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(value, name) => [`${value} users`, name]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Streak Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">3+ day streaks</span>
                          <span className="font-medium">{streakData.streaks_3_plus} users</span>
                        </div>
                        <Progress value={(streakData.streaks_3_plus / streakData.total_streaks) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">7+ day streaks</span>
                          <span className="font-medium">{streakData.streaks_7_plus} users</span>
                        </div>
                        <Progress value={(streakData.streaks_7_plus / streakData.total_streaks) * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">30+ day streaks</span>
                          <span className="font-medium">{streakData.streaks_30_plus} users</span>
                        </div>
                        <Progress value={(streakData.streaks_30_plus / streakData.total_streaks) * 100} className="h-2" />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Users with active streaks</span>
                          <Badge variant="outline">{Math.round((streakData.total_streaks / getTotalUserCount()) * 100)}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Retention rate (7+ days)</span>
                          <Badge variant="outline" className={streakData.streaks_7_plus > streakData.total_streaks * 0.5 ? "bg-green-50 text-green-700 border-green-200" : ""}>
                            {Math.round((streakData.streaks_7_plus / streakData.total_streaks) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakAnalytics;
