
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BarChart, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignROIData } from '@/services/promoterAnalyticsService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';

interface CampaignROICalculatorProps {
  campaignData: CampaignROIData | null;
  isLoading: boolean;
  onClose: () => void;
}

const CampaignROICalculator: React.FC<CampaignROICalculatorProps> = ({
  campaignData,
  isLoading,
  onClose
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaignData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Campaign ROI Analysis</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No campaign data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Create data for the ROI breakdown chart
  const roiBreakdownData = campaignData.breakdown.map(item => ({
    name: item.category,
    cost: item.cost,
    revenue: item.revenue,
    roi: parseFloat(item.roi.toFixed(1))
  }));
  
  // Create data for the channel performance chart
  const channelPerformanceData = campaignData.channel_performance.map(channel => ({
    name: channel.channel,
    impressions: channel.impressions / 100, // Scale down for better visualization
    clicks: channel.clicks,
    conversions: channel.conversions,
    ctr: parseFloat(channel.ctr.toFixed(1)),
    cvr: parseFloat(channel.cvr.toFixed(1))
  }));

  const roiColorClass = campaignData.roi_percentage >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{campaignData.name}</CardTitle>
          <CardDescription>Campaign ROI Analysis</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ROI Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Total Cost</h4>
            <p className="text-2xl font-bold">${campaignData.total_cost.toFixed(2)}</p>
            <div className="mt-1 text-xs text-muted-foreground">Campaign investment</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Total Revenue</h4>
            <p className="text-2xl font-bold">${campaignData.total_revenue.toFixed(2)}</p>
            <div className="mt-1 text-xs text-muted-foreground">Generated revenue</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">ROI</h4>
            <p className={`text-2xl font-bold ${roiColorClass}`}>
              {campaignData.roi_percentage >= 0 ? '+' : ''}{campaignData.roi_percentage.toFixed(1)}%
            </p>
            <div className="mt-1 text-xs text-muted-foreground">
              Return on investment
            </div>
          </div>
        </div>

        {/* ROI Breakdown */}
        <div>
          <h3 className="font-medium mb-3">ROI Breakdown by Category</h3>
          <div className="h-[250px]">
            <AnalyticsBarChart
              title=""
              data={roiBreakdownData}
              series={[
                {
                  key: "cost",
                  name: "Cost",
                  color: "#EF4444"
                },
                {
                  key: "revenue",
                  name: "Revenue",
                  color: "#10B981"
                },
                {
                  key: "roi",
                  name: "ROI %",
                  color: "#6366F1"
                }
              ]}
              formatter={(value) => [value, ""]}
            />
          </div>
        </div>

        {/* Channel Performance */}
        <div>
          <h3 className="font-medium mb-3">Channel Performance Metrics</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>CVR</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>CPC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignData.channel_performance.map((channel, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{channel.channel}</TableCell>
                  <TableCell>{channel.impressions.toLocaleString()}</TableCell>
                  <TableCell>{channel.clicks.toLocaleString()}</TableCell>
                  <TableCell>{channel.ctr.toFixed(1)}%</TableCell>
                  <TableCell>{channel.conversions.toLocaleString()}</TableCell>
                  <TableCell>{channel.cvr.toFixed(1)}%</TableCell>
                  <TableCell>${channel.cost.toFixed(2)}</TableCell>
                  <TableCell>${channel.cpc.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Channel Performance Visualization */}
        <div>
          <h3 className="font-medium mb-3">Channel Comparison</h3>
          <div className="h-[250px]">
            <AnalyticsBarChart
              title=""
              data={channelPerformanceData}
              series={[
                {
                  key: "impressions",
                  name: "Impressions (x100)",
                  color: "#60A5FA"
                },
                {
                  key: "clicks",
                  name: "Clicks",
                  color: "#F97316"
                },
                {
                  key: "conversions",
                  name: "Conversions",
                  color: "#10B981"
                }
              ]}
              formatter={(value) => [value, ""]}
            />
          </div>
        </div>

        {/* Conversion Rate Comparison */}
        <div>
          <h3 className="font-medium mb-3">Conversion Rate by Channel</h3>
          <div className="h-[250px]">
            <AnalyticsBarChart
              title=""
              data={channelPerformanceData}
              series={[
                {
                  key: "ctr",
                  name: "Click-Through Rate %",
                  color: "#8B5CF6"
                },
                {
                  key: "cvr",
                  name: "Conversion Rate %",
                  color: "#EC4899"
                }
              ]}
              formatter={(value) => [value, "%"]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignROICalculator;
