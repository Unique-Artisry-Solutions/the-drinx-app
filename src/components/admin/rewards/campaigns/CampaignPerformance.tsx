
import React from 'react';
import { ComponentRewardCampaign } from '@/types/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CampaignPerformanceProps {
  campaign: ComponentRewardCampaign;
}

export const CampaignPerformance = ({ campaign }: CampaignPerformanceProps) => {
  const metrics = campaign.performanceMetrics || {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0
  };

  const clickThroughRate = metrics.impressions > 0 
    ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2)
    : '0';

  const conversionRate = metrics.clicks > 0 
    ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2)
    : '0';

  const budgetUsed = campaign.budget > 0 
    ? ((metrics.spend / campaign.budget) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Performance metrics for {campaign.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Impressions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics.conversions.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${metrics.spend.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Spend</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Click-Through Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">CTR</span>
                <span className="text-sm text-muted-foreground">{clickThroughRate}%</span>
              </div>
              <Progress value={parseFloat(clickThroughRate)} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Conversions</span>
                <span className="text-sm text-muted-foreground">{conversionRate}%</span>
              </div>
              <Progress value={parseFloat(conversionRate)} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">
                ${metrics.spend.toFixed(2)} of ${(campaign.budget || 0).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">{budgetUsed.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUsed} className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
