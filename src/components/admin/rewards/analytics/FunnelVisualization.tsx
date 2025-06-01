
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, Users } from 'lucide-react';

interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
}

const FunnelVisualization = () => {
  const funnelData: FunnelStep[] = [
    { step: 'Total Users', users: 1500, conversionRate: 100 },
    { step: 'Visited Rewards Page', users: 1200, conversionRate: 80 },
    { step: 'Viewed Available Rewards', users: 900, conversionRate: 75 },
    { step: 'Started Redemption Process', users: 600, conversionRate: 66 },
    { step: 'Successfully Redeemed Reward', users: 450, conversionRate: 75 }
  ];

  const totalUsers = funnelData[0].users;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Redemption Funnel</CardTitle>
        <CardDescription>
          Visualize the user journey through the reward redemption process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelData.map((step, index) => {
          const percentage = (step.users / totalUsers) * 100;
          const previousStep = funnelData[index - 1] ? funnelData[index - 1].users : totalUsers;
          const stepConversionRate = index > 0 ? (step.users / previousStep) * 100 : 100;

          return (
            <div key={step.step} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.step}</span>
                <span className="text-sm text-muted-foreground">
                  {step.users.toLocaleString()} users ({percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              {index > 0 && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span>
                    {stepConversionRate.toFixed(1)}% conversion rate from previous step
                  </span>
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Optimize each step to improve overall reward redemption rates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelVisualization;
