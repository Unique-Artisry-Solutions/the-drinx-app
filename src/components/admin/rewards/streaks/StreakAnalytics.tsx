
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StreakAnalyticsProps {
  // Optional props for future extensions
}

interface StreakMetrics {
  streak_type: string;
  total_streaks: number;
  avg_current_streak_length: number;
  max_streak_length: number;
  streaks_3_plus: number;
  streaks_7_plus: number;
  streaks_30_plus: number;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StreakAnalytics: React.FC<StreakAnalyticsProps> = () => {
  const [streakData, setStreakData] = useState<StreakMetrics[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [selectedStreakType, setSelectedStreakType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStreakPerformance();
  }, []);
  
  const fetchStreakPerformance = async () => {
    setLoading(true);
    try {
      const { data: streakPerformance, error } = await supabase
        .from('streak_performance')
        .select('*');
        
      if (error) throw error;
      
      setStreakData(streakPerformance || []);
      
      if (streakPerformance && streakPerformance.length > 0) {
        setSelectedStreakType(streakPerformance[0].streak_type);
      }
      
      // For now, generate mock historical data - would be replaced with real endpoint
      generateMockHistoricalData();
    } catch (error) {
      console.error('Error fetching streak performance:', error);
      toast({
        title: 'Failed to load streak data',
        description: 'There was an error loading streak analytics.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockHistoricalData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        'New Streaks': Math.floor(Math.random() * 15) + 5,
        'Broken Streaks': Math.floor(Math.random() * 10) + 2,
        'Average Length': (Math.random() * 3) + 2
      });
    }
    
    setHistoricalData(data);
  };
  
  const getDistributionData = (): ChartData[] => {
    if (!streakData.length) return [];
    
    const currentStreak = streakData.find(d => d.streak_type === selectedStreakType);
    if (!currentStreak) return [];
    
    return [
      { name: '1-2 days', value: currentStreak.total_streaks - currentStreak.streaks_3_plus },
      { name: '3-6 days', value: currentStreak.streaks_3_plus - currentStreak.streaks_7_plus },
      { name: '7-29 days', value: currentStreak.streaks_7_plus - currentStreak.streaks_30_plus },
      { name: '30+ days', value: currentStreak.streaks_30_plus }
    ];
  };
  
  const getComparisonData = (): ChartData[] => {
    return streakData.map(streak => ({
      name: streak.streak_type.replace(/_/g, ' '),
      value: parseFloat(streak.avg_current_streak_length.toFixed(1))
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Streak Analytics</CardTitle>
            <CardDescription>Performance metrics for user streaks</CardDescription>
          </div>
          
          {streakData.length > 0 && (
            <Select value={selectedStreakType} onValueChange={setSelectedStreakType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select streak type" />
              </SelectTrigger>
              <SelectContent>
                {streakData.map(streak => (
                  <SelectItem key={streak.streak_type} value={streak.streak_type}>
                    {streak.streak_type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {streakData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="text-muted-foreground mb-2">No streak data available yet</div>
            <p className="text-sm text-muted-foreground max-w-md">
              As users start building streaks on your platform, analytics will appear here.
              Configure streak settings to begin tracking user engagement.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {parseFloat(streakData.find(d => d.streak_type === selectedStreakType)?.avg_current_streak_length.toFixed(1) || '0')} days
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {streakData.find(d => d.streak_type === selectedStreakType)?.max_streak_length || 0} days
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">7+ Day Streaks</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {streakData.find(d => d.streak_type === selectedStreakType)?.streaks_7_plus || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Streak Growth</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="New Streaks" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Broken Streaks" stroke="#ff7300" />
                        <Line type="monotone" dataKey="Average Length" stroke="#4caf50" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Streak Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="New Streaks" fill="#8884d8" />
                        <Bar dataKey="Broken Streaks" fill="#ff7300" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Streak Length Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Streak Type Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getComparisonData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Avg. Streak Length" fill="#8884d8">
                          {getComparisonData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakAnalytics;
