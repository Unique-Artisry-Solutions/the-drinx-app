import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Gift, DollarSign, Target } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

interface TierData {
  tier: string;
  users: number;
}

interface EngagementData {
  name: string;
  engagement: number;
}

interface RedemptionData {
  name: string;
  redemptions: number;
}

const RewardsAnalyticsPanel = () => {
  const [_selectedPeriod, setSelectedPeriod] = useState('30d');

  const metricCards = [
    {
      title: 'Total Users',
      value: 4528,
      change: '+12.5%',
      icon: Users,
      iconColor: 'text-blue-500'
    },
    {
      title: 'Points Awarded',
      value: 125896,
      change: '+8.7%',
      icon: Gift,
      iconColor: 'text-green-500'
    },
    {
      title: 'Points Redeemed',
      value: 89654,
      change: '-3.2%',
      icon: DollarSign,
      iconColor: 'text-amber-500'
    },
    {
      title: 'Conversion Rate',
      value: '15.2%',
      change: '+1.5%',
      icon: Target,
      iconColor: 'text-purple-500'
    }
  ];

  const tierData: TierData[] = [
    { tier: 'Bronze', users: 1824 },
    { tier: 'Silver', users: 1256 },
    { tier: 'Gold', users: 892 },
    { tier: 'Platinum', users: 556 }
  ];

  const engagementData: EngagementData[] = [
    { name: 'Week 1', engagement: 68 },
    { name: 'Week 2', engagement: 74 },
    { name: 'Week 3', engagement: 71 },
    { name: 'Week 4', engagement: 79 }
  ];

  const redemptionData: RedemptionData[] = [
    { name: 'Jan', redemptions: 52 },
    { name: 'Feb', redemptions: 61 },
    { name: 'Mar', redemptions: 48 },
    { name: 'Apr', redemptions: 55 },
    { name: 'May', redemptions: 63 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Rewards Analytics</h2>
        <div className="space-x-2">
          <Badge variant="secondary">Last 30 Days</Badge>
          <Badge variant="outline">Last 90 Days</Badge>
          <Badge variant="outline">All Time</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-muted-foreground">
                  <TrendingUp className="inline-block h-4 w-4 mr-1 align-middle" />
                  {card.change} vs last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Points Distribution by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tierData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Engagement rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Redemption Trends</CardTitle>
          <CardDescription>Number of redemptions per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={redemptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="redemptions" fill="#ffc658" />
            </BarChart>
          </CardContent>
        </Card>
    </div>
  );
};

export default RewardsAnalyticsPanel;
