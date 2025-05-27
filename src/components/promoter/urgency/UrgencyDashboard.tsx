
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UrgencyCampaignManager } from './UrgencyCampaignManager';
import { CountdownTimerManager } from './CountdownTimerManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Timer, Target, Zap } from 'lucide-react';

interface UrgencyDashboardProps {
  promoterId: string;
  eventId?: string;
  swigCircuitId?: string;
}

export const UrgencyDashboard: React.FC<UrgencyDashboardProps> = ({
  promoterId,
  eventId,
  swigCircuitId
}) => {
  // Mock analytics data
  const urgencyMetrics = {
    activeCampaigns: 3,
    activeTimers: 2,
    totalConversions: 127,
    conversionRate: 12.5,
    averageUplift: 23.8
  };

  return (
    <div className="space-y-6">
      {/* Urgency Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Active Campaigns</div>
            </div>
            <div className="text-2xl font-bold mt-1">{urgencyMetrics.activeCampaigns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Active Timers</div>
            </div>
            <div className="text-2xl font-bold mt-1">{urgencyMetrics.activeTimers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Conversions</div>
            </div>
            <div className="text-2xl font-bold mt-1">{urgencyMetrics.totalConversions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Conversion Rate</div>
            </div>
            <div className="text-2xl font-bold mt-1">{urgencyMetrics.conversionRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <div className="text-sm font-medium">Average Uplift</div>
            </div>
            <div className="text-2xl font-bold mt-1">+{urgencyMetrics.averageUplift}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Urgency Management Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Urgency Campaigns
          </TabsTrigger>
          <TabsTrigger value="timers" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Countdown Timers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <UrgencyCampaignManager 
            promoterId={promoterId}
            onCreateCampaign={() => console.log('Create campaign')}
            onEditCampaign={(campaign) => console.log('Edit campaign:', campaign)}
          />
        </TabsContent>

        <TabsContent value="timers" className="space-y-6">
          <CountdownTimerManager 
            promoterId={promoterId}
            eventId={eventId}
            swigCircuitId={swigCircuitId}
            onCreateTimer={() => console.log('Create timer')}
            onEditTimer={(timer) => console.log('Edit timer:', timer)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
