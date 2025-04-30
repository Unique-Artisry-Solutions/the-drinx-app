
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StreakSettingsManager from './streaks/StreakSettingsManager';
import StreakAnalytics from './streaks/StreakAnalytics';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const StreaksTab: React.FC = () => {
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
      
      <div className="grid grid-cols-1 gap-6">
        <StreakSettingsManager />
        <StreakAnalytics />
      </div>
      
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
