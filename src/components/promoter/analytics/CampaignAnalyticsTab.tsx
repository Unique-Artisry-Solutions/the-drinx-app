
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CampaignPerformance } from '@/services/promoterAnalyticsService';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { safeFormatDate } from '@/utils/environment';

interface CampaignAnalyticsTabProps {
  campaignPerformance: CampaignPerformance[];
  isLoading: boolean;
  onCampaignSelect?: (campaignId: string) => void;
}

const CampaignAnalyticsTab: React.FC<CampaignAnalyticsTabProps> = ({
  campaignPerformance,
  isLoading,
  onCampaignSelect
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(
    campaignPerformance.length > 0 ? campaignPerformance[0].id : null
  );
  
  // Selected campaign details with null safety
  const campaignDetails = React.useMemo(() => {
    return campaignPerformance.find(c => c.id === selectedCampaign) || null;
  }, [campaignPerformance, selectedCampaign]);
  
  // Format data for campaign comparison chart with safety checks
  const campaignComparisonData = React.useMemo(() => {
    if (!campaignPerformance?.length) return [];
    
    return campaignPerformance.map(campaign => ({
      name: campaign.name || 'Unnamed Campaign',
      reach: campaign.reach || 0,
      engagement: campaign.engagement || 0,
      conversion: Math.round((campaign.reach || 0) * ((campaign.conversion_rate || 0) / 100))
    }));
  }, [campaignPerformance]);

  const handleCampaignClick = (campaign: CampaignPerformance) => {
    setSelectedCampaign(campaign.id);
    if (onCampaignSelect) {
      onCampaignSelect(campaign.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  if (!campaignPerformance || campaignPerformance.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">No campaign data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Comparison</CardTitle>
          <CardDescription>Compare reach, engagement, and conversions across campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsBarChart
            title=""
            description=""
            data={campaignComparisonData}
            series={[
              {
                key: "reach",
                name: "Reach",
                color: "#8B5CF6"
              },
              {
                key: "engagement",
                name: "Engagement",
                color: "#06B6D4"
              },
              {
                key: "conversion",
                name: "Conversions",
                color: "#10B981"
              }
            ]}
            formatter={(value) => [`${value}`, 'people']}
            height={300}
          />
        </CardContent>
      </Card>
      
      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Performance metrics for all your marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Dates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignPerformance.map((campaign) => (
                <TableRow 
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign)}
                  className={`cursor-pointer hover:bg-muted/50 ${selectedCampaign === campaign.id ? 'bg-muted/30' : ''}`}
                >
                  <TableCell className="font-medium">{campaign.name || 'Unnamed Campaign'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      campaign.status === 'active' ? 'default' :
                      campaign.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {campaign.status || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.reach || 0}</TableCell>
                  <TableCell>{campaign.engagement || 0}</TableCell>
                  <TableCell>
                    {campaign.conversion_rate !== undefined ? 
                      `${campaign.conversion_rate.toFixed(1)}%` : '0.0%'}
                  </TableCell>
                  <TableCell>
                    {safeFormatDate(campaign.start_date, 'MMM d')} - 
                    {safeFormatDate(campaign.end_date, 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Selected Campaign Details */}
      {campaignDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details: {campaignDetails.name || 'Unnamed Campaign'}</CardTitle>
            <CardDescription>
              Detailed performance metrics for the selected campaign
            </CardDescription>
            <Badge variant={
              campaignDetails.status === 'active' ? 'default' :
              campaignDetails.status === 'completed' ? 'secondary' : 'outline'
            } className="mt-1">
              {campaignDetails.status || 'unknown'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Reach</div>
                <div className="text-2xl font-bold">{campaignDetails.reach || 0}</div>
                <div className="text-xs text-muted-foreground">people</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Engagement</div>
                <div className="text-2xl font-bold">{campaignDetails.engagement || 0}</div>
                <div className="text-xs text-muted-foreground">people</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Conversions</div>
                <div className="text-2xl font-bold">
                  {Math.round((campaignDetails.reach || 0) * ((campaignDetails.conversion_rate || 0) / 100))}
                </div>
                <div className="text-xs text-muted-foreground">people</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Engagement Rate</div>
                <div className="text-sm">
                  {campaignDetails.reach && campaignDetails.engagement ? 
                    ((campaignDetails.engagement / campaignDetails.reach) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              <Progress value={campaignDetails.reach && campaignDetails.engagement ? 
                (campaignDetails.engagement / campaignDetails.reach) * 100 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm font-medium">Conversion Rate</div>
                <div className="text-sm">
                  {campaignDetails.conversion_rate !== undefined ? 
                    `${campaignDetails.conversion_rate.toFixed(1)}%` : '0.0%'}
                </div>
              </div>
              <Progress value={campaignDetails.conversion_rate || 0} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Start Date</div>
                <div>{safeFormatDate(campaignDetails.start_date, 'MMMM d, yyyy', 'No start date')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">End Date</div>
                <div>{safeFormatDate(campaignDetails.end_date, 'MMMM d, yyyy', 'No end date')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignAnalyticsTab;
