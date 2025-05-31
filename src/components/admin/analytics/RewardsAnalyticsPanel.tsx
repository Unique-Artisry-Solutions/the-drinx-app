
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RewardsAnalyticsPanelProps {
  establishmentId?: string;
}

export function RewardsAnalyticsPanel({ }: RewardsAnalyticsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analytics data - preserved as placeholder
  const rewardsData = [
    { month: 'Jan', points: 1200, redemptions: 45 },
    { month: 'Feb', points: 1800, redemptions: 67 },
    { month: 'Mar', points: 2400, redemptions: 89 },
    { month: 'Apr', points: 2100, redemptions: 76 }
  ];

  const topPrograms = [
    { name: 'VIP Rewards', engagement: 85, conversions: 12 },
    { name: 'Loyalty Points', engagement: 92, conversions: 18 },
    { name: 'Referral Bonus', engagement: 67, conversions: 8 }
  ];

  const membershipTiers = [
    { tier: 'Bronze', members: 1245, percentage: 62 },
    { tier: 'Silver', members: 456, percentage: 23 },
    { tier: 'Gold', members: 189, percentage: 9 },
    { tier: 'Platinum', members: 67, percentage: 3 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rewards Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rewardsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="#8884d8" />
                    <Bar dataKey="redemptions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
              {topPrograms.map((program) => (
                <Card key={program.name}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{program.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {program.engagement}% engagement
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      {program.conversions} conversions this month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              {membershipTiers.map((tier) => (
                <div key={tier.tier} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{tier.tier}</div>
                    <div className="text-sm text-muted-foreground">{tier.members} members</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tier.percentage}%</div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
