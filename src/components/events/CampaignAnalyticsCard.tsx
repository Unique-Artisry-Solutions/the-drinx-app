import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { getCampaignAnalytics } from '@/services/eventAnalyticsService';

interface CampaignAnalyticsCardProps {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  eventId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CampaignAnalyticsCard: React.FC<CampaignAnalyticsCardProps> = ({ 
  campaignId, 
  campaignName, 
  campaignType,
  eventId 
}) => {
  const [analytics, setAnalytics] = React.useState<{
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
    sources: Record<string, any>;
  }>({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    sources: {}
  });

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getCampaignAnalytics(campaignId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading campaign analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [campaignId]);

  // Format source data for charts
  const sourceData = Object.entries(analytics.sources).map(([source, data]: [string, any]) => ({
    name: source,
    impressions: data.impressions,
    clicks: data.clicks,
    conversions: data.conversions,
    revenue: data.revenue
  }));

  const funnelData = [
    { name: 'Impressions', value: analytics.impressions },
    { name: 'Clicks', value: analytics.clicks },
    { name: 'Conversions', value: analytics.conversions },
  ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{campaignName}</span>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{campaignType}</span>
        </CardTitle>
        <CardDescription>
          {analytics.impressions > 0 ? `${analytics.impressions} impressions` : 'No data yet'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analytics.impressions > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Click-Through Rate</div>
                <div className="text-xl font-bold">{analytics.ctr.toFixed(1)}%</div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Conversion Rate</div>
                <div className="text-xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                <div className="text-xl font-bold">${analytics.revenue.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Campaign Funnel</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Impressions</span>
                    <span>{analytics.impressions}</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Clicks</span>
                    <span>{analytics.clicks} ({analytics.ctr.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-green-100 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${(analytics.clicks / analytics.impressions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Conversions</span>
                    <span>{analytics.conversions} ({analytics.conversionRate.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-amber-100 rounded-full">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${(analytics.conversions / analytics.impressions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {sourceData.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Performance by Source</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sourceData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" name="Impressions" fill="#8884d8" />
                      <Bar dataKey="clicks" name="Clicks" fill="#82ca9d" />
                      <Bar dataKey="conversions" name="Conversions" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
              <a href={`/events/${eventId}/marketing/${campaignId}`} className="flex items-center hover:underline">
                View detailed analytics
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-center text-gray-500 mb-4">
              No analytics data available yet
            </div>
            <p className="text-sm text-gray-400 text-center max-w-sm">
              Analytics for this campaign will appear here once it starts receiving impressions and engagements.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignAnalyticsCard;
