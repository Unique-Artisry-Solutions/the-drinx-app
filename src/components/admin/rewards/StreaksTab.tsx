
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StreakSettingsManager from './streaks/StreakSettingsManager';
import StreakAnalytics from './streaks/StreakAnalytics';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const StreaksTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [streakPerformanceData, setStreakPerformanceData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStreakPerformance = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('streak_performance')
          .select('*');

        if (error) throw error;
        setStreakPerformanceData(data || []);
      } catch (error) {
        console.error('Error fetching streak performance data:', error);
        toast({
          title: 'Failed to load streak data',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakPerformance();
  }, [toast]);

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>About Streaks</AlertTitle>
        <AlertDescription>
          User streaks encourage consistent engagement by tracking and rewarding consecutive activities.
          Configure milestones and rewards to incentivize regular participation in your platform.
        </AlertDescription>
      </Alert>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Streak Performance Overview</CardTitle>
                <CardDescription>Current streak statistics across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {streakPerformanceData.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    No streak data available yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {streakPerformanceData.map((streak, index) => (
                      <div key={index} className="p-4 border rounded-md bg-background">
                        <h3 className="font-semibold mb-2 capitalize">
                          {streak.streak_type?.replace(/_/g, ' ')}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Streaks:</span>
                            <span className="font-medium">{streak.total_streaks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Length:</span>
                            <span className="font-medium">{parseFloat(streak.avg_current_streak_length).toFixed(1)} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max Streak:</span>
                            <span className="font-medium">{streak.max_streak_length} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">7+ Day Streaks:</span>
                            <span className="font-medium">{streak.streaks_7_plus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">30+ Day Streaks:</span>
                            <span className="font-medium">{streak.streaks_30_plus}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <StreakSettingsManager />
          </div>
          
          <StreakAnalytics />
        </>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Streak Best Practices</CardTitle>
          <CardDescription>Tips for effective streak management</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md bg-background">
              <h3 className="font-semibold mb-2">⭐️ Milestone Design</h3>
              <p className="text-sm text-muted-foreground">
                Space out milestones at increasing intervals (3, 7, 14, 30 days, etc.)
                with rewards that scale meaningfully to maintain engagement over time.
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-background">
              <h3 className="font-semibold mb-2">🕒 Grace Periods</h3>
              <p className="text-sm text-muted-foreground">
                Set reasonable grace periods (24-48 hours) to accommodate occasional 
                missed days while still encouraging regular participation.
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-background">
              <h3 className="font-semibold mb-2">🏆 Progressive Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Increase reward value exponentially for longer streaks to motivate 
                users to maintain participation through the critical drop-off points.
              </p>
            </div>
            
            <div className="p-4 border rounded-md bg-background">
              <h3 className="font-semibold mb-2">📊 Monitor Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Regularly check streak analytics to identify drop-off points and 
                adjust milestone rewards or grace periods to improve retention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreaksTab;
