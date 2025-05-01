
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

  // Create data for the channel performance chart
  const channelPerformanceData = campaignData.channels.map(channel => ({
    name: channel.name,
    cost: channel.cost,
    revenue: channel.revenue
  }));
  
  // Create data for the ROI over time chart
  const roiTimeframeData = campaignData.timeframes.map(tf => ({
    name: tf.period,
    roi: tf.roi
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{campaignData.campaignName}</CardTitle>
          <CardDescription>
            {campaignData.startDate} to {campaignData.endDate || 'Present'}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ROI Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Marketing Cost</h4>
            <p className="text-2xl font-bold">${campaignData.marketingCost}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Revenue</h4>
            <p className="text-2xl font-bold">${campaignData.revenue}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">Tickets Sold</h4>
            <p className="text-2xl font-bold">{campaignData.ticketsSold}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <h4 className="text-sm font-medium text-muted-foreground">ROI</h4>
            <p className={`text-2xl font-bold ${campaignData.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {campaignData.roi}%
            </p>
          </div>
        </div>

        {/* Channel Performance */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-3">Channel Performance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.channels.map((channel, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{channel.name}</TableCell>
                    <TableCell>${channel.cost}</TableCell>
                    <TableCell>{channel.conversions}</TableCell>
                    <TableCell>${channel.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="h-[250px]">
            <h3 className="font-medium mb-3">Channel Cost vs Revenue</h3>
            <AnalyticsBarChart
              title=""
              description=""
              data={channelPerformanceData}
              series={[
                {
                  key: "cost",
                  name: "Cost",
                  color: "#F97316"
                },
                {
                  key: "revenue",
                  name: "Revenue",
                  color: "#10B981"
                }
              ]}
              formatter={(value) => [`$${value}`, ""]}
            />
          </div>
        </div>

        {/* ROI Over Time */}
        <div>
          <h3 className="font-medium mb-3">ROI Over Time</h3>
          <div className="h-[250px]">
            <AnalyticsBarChart
              title=""
              description=""
              data={roiTimeframeData}
              series={[
                {
                  key: "roi",
                  name: "ROI %",
                  color: "#8B5CF6"
                }
              ]}
              formatter={(value) => [`${value}%`, ""]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignROICalculator;
