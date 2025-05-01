
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CampaignPerformance } from '@/services/promoterAnalyticsService';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
  const [selectedCampaign, setSelectedCampaign] = useState<string>(
    campaignPerformance.length > 0 ? campaignPerformance[0].id : ''
  );
  
  // Get the selected campaign details
  const selectedCampaignData = campaignPerformance.find(
    campaign => campaign.id === selectedCampaign
  );
  
  // Format data for ROI calculation
  const roiData = React.useMemo(() => {
    if (!selectedCampaignData) return [];
    
    // Mocking the cost and revenue data as these would typically come from actual campaign data
    const campaignCost = selectedCampaignData.reach * 0.2; // Assuming $0.2 per reach
    const conversionValue = selectedCampaignData.reach * (selectedCampaignData.conversion_rate/100) * 15; // $15 per conversion
    const roi = ((conversionValue - campaignCost) / campaignCost) * 100;
    
    return [
      { name: 'Campaign Cost', value: campaignCost },
      { name: 'Revenue', value: conversionValue },
      { name: 'ROI', value: roi }
    ];
  }, [selectedCampaignData]);
  
  // Source distribution data (mock data based on selected campaign)
  const sourceDistribution = React.useMemo(() => {
    if (!selectedCampaignData) return [];
    
    // Mock distribution based on campaign reach
    const reachBase = selectedCampaignData.reach;
    
    return [
      { name: 'Social Media', value: Math.round(reachBase * 0.4) },
      { name: 'Email', value: Math.round(reachBase * 0.3) },
      { name: 'Direct', value: Math.round(reachBase * 0.15) },
      { name: 'Referral', value: Math.round(reachBase * 0.15) }
    ];
  }, [selectedCampaignData]);

  // Campaign conversion funnel data
  const conversionFunnelData = React.useMemo(() => {
    if (!selectedCampaignData) return [];
    
    const reach = selectedCampaignData.reach;
    const engagement = selectedCampaignData.engagement;
    const clicks = Math.round(engagement * 0.6); // Assuming 60% of engagements lead to clicks
    const conversions = Math.round(reach * (selectedCampaignData.conversion_rate/100));
    
    return [
      { name: 'Reach', value: reach },
      { name: 'Engagement', value: engagement },
      { name: 'Clicks', value: clicks },
      { name: 'Conversions', value: conversions }
    ];
  }, [selectedCampaignData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  if (campaignPerformance.length === 0) {
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Campaign Performance Analytics</h3>
        <Select 
          value={selectedCampaign} 
          onValueChange={(value) => {
            setSelectedCampaign(value);
            if (onCampaignSelect) {
              onCampaignSelect(value);
            }
          }}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaignPerformance.map(campaign => (
              <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedCampaignData && (
        <>
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedCampaignData.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Badge className={`mr-2 ${
                  selectedCampaignData.status === 'active' ? 'bg-green-500' : 
                  selectedCampaignData.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {selectedCampaignData.status}
                </Badge>
                {new Date(selectedCampaignData.start_date).toLocaleDateString()} - 
                {selectedCampaignData.end_date ? 
                  ` ${new Date(selectedCampaignData.end_date).toLocaleDateString()}` : 
                  ' Ongoing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground text-xs">Total Reach</div>
                  <div className="text-2xl font-bold">{selectedCampaignData.reach}</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground text-xs">Total Engagement</div>
                  <div className="text-2xl font-bold">{selectedCampaignData.engagement}</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground text-xs">Conversion Rate</div>
                  <div className="text-2xl font-bold">{selectedCampaignData.conversion_rate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                From audience reach to final conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsBarChart
                title=""
                description=""
                data={conversionFunnelData}
                series={[
                  {
                    key: "value",
                    name: "Count",
                    color: "#8B5CF6"
                  }
                ]}
                formatter={(value) => [`${value}`, '']}
                height={300}
              />
            </CardContent>
          </Card>
          
          {/* ROI Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign ROI</CardTitle>
                <CardDescription>
                  Return on investment calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableBody>
                      {roiData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            {item.name === 'ROI' ? 
                              `${item.value.toFixed(2)}%` : 
                              `$${item.value.toFixed(2)}`
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">ROI Status</div>
                    <div className={`text-lg font-semibold ${roiData[2]?.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {roiData[2]?.value >= 100 ? 'Excellent' : 
                       roiData[2]?.value >= 50 ? 'Good' : 
                       roiData[2]?.value >= 0 ? 'Positive' : 'Negative'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Traffic Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Breakdown of campaign reach by source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsPieChart
                  title=""
                  description=""
                  data={sourceDistribution}
                  colors={['#10B981', '#8B5CF6', '#F59E0B', '#06B6D4']}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Campaign Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>
                Complete performance breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Campaign Name</TableCell>
                    <TableCell>{selectedCampaignData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>{selectedCampaignData.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Start Date</TableCell>
                    <TableCell>{new Date(selectedCampaignData.start_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End Date</TableCell>
                    <TableCell>
                      {selectedCampaignData.end_date ? 
                        new Date(selectedCampaignData.end_date).toLocaleDateString() : 
                        'Ongoing'
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Reach</TableCell>
                    <TableCell>{selectedCampaignData.reach}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Engagement</TableCell>
                    <TableCell>{selectedCampaignData.engagement}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Engagement Rate</TableCell>
                    <TableCell>{((selectedCampaignData.engagement / selectedCampaignData.reach) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Conversion Rate</TableCell>
                    <TableCell>{selectedCampaignData.conversion_rate}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Click-Through Rate</TableCell>
                    <TableCell>
                      {((selectedCampaignData.engagement * 0.6 / selectedCampaignData.reach) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost per Acquisition</TableCell>
                    <TableCell>
                      ${(selectedCampaignData.reach * 0.2 / (selectedCampaignData.reach * (selectedCampaignData.conversion_rate/100))).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CampaignAnalyticsTab;
