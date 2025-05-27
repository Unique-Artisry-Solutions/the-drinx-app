
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Mail, MessageSquare, Eye, MousePointer, Target, DollarSign } from 'lucide-react';

interface CampaignMetrics {
  campaignName: string;
  type: 'email' | 'sms' | 'social' | 'display';
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  roas: number;
  date: string;
}

interface CampaignPerformanceTrackerProps {
  campaignId: string;
}

export default function CampaignPerformanceTracker({ campaignId }: CampaignPerformanceTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('conversions');

  const performanceData: CampaignMetrics[] = [
    {
      campaignName: 'Summer Event Email',
      type: 'email',
      impressions: 5000,
      clicks: 350,
      conversions: 45,
      revenue: 2250,
      ctr: 7.0,
      conversionRate: 12.9,
      roas: 4.5,
      date: '2024-01-08'
    },
    {
      campaignName: 'Last Minute SMS',
      type: 'sms',
      impressions: 1200,
      clicks: 180,
      conversions: 32,
      revenue: 1600,
      ctr: 15.0,
      conversionRate: 17.8,
      roas: 5.3,
      date: '2024-01-08'
    },
    {
      campaignName: 'Social Media Boost',
      type: 'social',
      impressions: 15000,
      clicks: 420,
      conversions: 28,
      revenue: 1400,
      ctr: 2.8,
      conversionRate: 6.7,
      roas: 2.8,
      date: '2024-01-08'
    }
  ];

  const timeSeriesData = [
    { date: '2024-01-02', impressions: 4200, clicks: 294, conversions: 35, revenue: 1750 },
    { date: '2024-01-03', impressions: 4800, clicks: 336, conversions: 42, revenue: 2100 },
    { date: '2024-01-04', impressions: 5200, clicks: 364, conversions: 48, revenue: 2400 },
    { date: '2024-01-05', impressions: 4600, clicks: 322, conversions: 38, revenue: 1900 },
    { date: '2024-01-06', impressions: 5800, clicks: 406, conversions: 52, revenue: 2600 },
    { date: '2024-01-07', impressions: 6200, clicks: 434, conversions: 58, revenue: 2900 },
    { date: '2024-01-08', impressions: 6800, clicks: 476, conversions: 65, revenue: 3250 }
  ];

  const channelData = [
    { name: 'Email', value: 45, color: '#3b82f6' },
    { name: 'SMS', value: 32, color: '#10b981' },
    { name: 'Social', value: 28, color: '#f59e0b' },
    { name: 'Display', value: 15, color: '#ef4444' }
  ];

  const totalMetrics = {
    impressions: performanceData.reduce((sum, item) => sum + item.impressions, 0),
    clicks: performanceData.reduce((sum, item) => sum + item.clicks, 0),
    conversions: performanceData.reduce((sum, item) => sum + item.conversions, 0),
    revenue: performanceData.reduce((sum, item) => sum + item.revenue, 0)
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Campaign Performance Tracking
        </h2>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold">{totalMetrics.impressions.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{totalMetrics.clicks.toLocaleString()}</p>
              </div>
              <MousePointer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">{totalMetrics.conversions}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${totalMetrics.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaignName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impressions" fill="#3b82f6" />
                  <Bar dataKey="clicks" fill="#10b981" />
                  <Bar dataKey="conversions" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversions by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(campaign.type)}
                        <div>
                          <div className="font-medium">{campaign.campaignName}</div>
                          <Badge className={getTypeColor(campaign.type)}>
                            {campaign.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{campaign.conversions}</div>
                        <div className="text-sm text-gray-600">{campaign.conversionRate}% CVR</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-4">
            {performanceData.map((campaign, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTypeIcon(campaign.type)}
                      {campaign.campaignName}
                    </CardTitle>
                    <Badge className={getTypeColor(campaign.type)}>
                      {campaign.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{campaign.impressions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{campaign.clicks}</div>
                      <div className="text-sm text-gray-600">Clicks ({campaign.ctr}%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{campaign.conversions}</div>
                      <div className="text-sm text-gray-600">Conversions ({campaign.conversionRate}%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">${campaign.revenue}</div>
                      <div className="text-sm text-gray-600">Revenue (ROAS: {campaign.roas}x)</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Optimize</Button>
                    <Button variant="outline" size="sm">Duplicate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
