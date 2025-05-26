
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  Eye, 
  MousePointer, 
  ArrowUpRight,
  Calendar,
  Filter
} from 'lucide-react';
import { usePromoterAnalytics } from '@/hooks/usePromoterAnalytics';
import { useAuth } from '@/contexts/auth';
import { addDays } from 'date-fns';

const PromoterMarketingAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });

  const { 
    campaignPerformance, 
    audienceMetrics, 
    isLoading 
  } = usePromoterAnalytics({
    promoterId: user?.id,
    range: dateRange
  });

  // Calculate aggregated metrics
  const totalReach = campaignPerformance.reduce((sum, c) => sum + c.reach, 0);
  const totalEngagement = campaignPerformance.reduce((sum, c) => sum + c.engagement, 0);
  const avgConversionRate = campaignPerformance.length > 0 
    ? campaignPerformance.reduce((sum, c) => sum + c.conversion_rate, 0) / campaignPerformance.length 
    : 0;

  // Mock ROI data based on campaigns
  const totalCost = campaignPerformance.length * 250; // Estimated cost per campaign
  const totalRevenue = campaignPerformance.reduce((sum, c) => sum + (c.engagement * 0.5), 0); // Estimated revenue
  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

  // Audience demographics from metrics
  const audienceByAge = audienceMetrics.filter(m => m.metric_name === 'age_group');
  const audienceByLocation = audienceMetrics.filter(m => m.metric_name === 'location');
  const audienceByInterests = audienceMetrics.filter(m => m.metric_name === 'interests');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Analytics</h1>
            <p className="text-gray-600 mt-2">Track campaign performance and audience insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalReach > 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roi.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                Revenue vs. Ad Spend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaignPerformance.filter(c => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {campaignPerformance.length} total campaigns
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience Analytics</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Detailed performance metrics for all your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignPerformance.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.start_date} - {campaign.end_date}
                          </p>
                        </div>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{campaign.reach.toLocaleString()}</div>
                          <div className="text-muted-foreground">Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.engagement.toLocaleString()}</div>
                          <div className="text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.conversion_rate.toFixed(1)}%</div>
                          <div className="text-muted-foreground">Conversion</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {audienceByAge.map((segment) => (
                      <div key={segment.id} className="flex justify-between items-center">
                        <span className="text-sm">{segment.segment}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-spiritless-pink h-2 rounded-full" 
                              style={{ width: `${segment.metric_value}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{segment.metric_value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {audienceByLocation.map((segment) => (
                      <div key={segment.id} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{segment.segment}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${segment.metric_value}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{segment.metric_value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interest Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {audienceByInterests.map((segment) => (
                      <div key={segment.id} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{segment.segment}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${segment.metric_value}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{segment.metric_value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Attribution</CardTitle>
                  <CardDescription>Revenue generated by marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Total Revenue</span>
                      <span className="text-lg font-bold text-green-600">
                        ${totalRevenue.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Total Ad Spend</span>
                      <span className="text-lg font-bold text-red-600">
                        ${totalCost.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Net Profit</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${(totalRevenue - totalCost).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign ROI Breakdown</CardTitle>
                  <CardDescription>ROI performance by individual campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaignPerformance.slice(0, 5).map((campaign) => {
                      const campaignCost = 250;
                      const campaignRevenue = campaign.engagement * 0.5;
                      const campaignROI = ((campaignRevenue - campaignCost) / campaignCost) * 100;
                      
                      return (
                        <div key={campaign.id} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{campaign.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              campaignROI > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {campaignROI > 0 ? '+' : ''}{campaignROI.toFixed(0)}%
                            </span>
                            {campaignROI > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterMarketingAnalytics;
