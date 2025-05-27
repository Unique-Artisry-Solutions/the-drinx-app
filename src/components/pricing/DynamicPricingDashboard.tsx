
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';

export interface DynamicPricingDashboardProps {
  promoterId: string;
}

export const DynamicPricingDashboard: React.FC<DynamicPricingDashboardProps> = ({
  promoterId
}) => {
  // Mock pricing metrics data
  const pricingMetrics = {
    activeRules: 5,
    revenueIncrease: 12.3,
    demandScore: 85,
    avgAdjustment: 8.5
  };

  return (
    <div className="space-y-6">
      {/* Pricing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Active Rules</div>
            </div>
            <div className="text-2xl font-bold mt-1">{pricingMetrics.activeRules}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Revenue Increase</div>
            </div>
            <div className="text-2xl font-bold mt-1">+{pricingMetrics.revenueIncrease}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Demand Score</div>
            </div>
            <div className="text-2xl font-bold mt-1">{pricingMetrics.demandScore}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Avg Adjustment</div>
            </div>
            <div className="text-2xl font-bold mt-1">+{pricingMetrics.avgAdjustment}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Pricing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Dynamic pricing dashboard for promoter: {promoterId}
            </p>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
