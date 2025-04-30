
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessImpactData } from '@/lib/rewards/types';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { CircleDollarSign, TrendingUp, Users, Award } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface BusinessImpactSectionProps {
  data: BusinessImpactData;
  dateRange: DateRange;
}

export default function BusinessImpactSection({ data, dateRange }: BusinessImpactSectionProps) {
  // Format date range for display
  const getDateRangeDisplay = () => {
    if (!dateRange.from) return "Selected period";
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const fromDate = (dateRange.from as Date).toLocaleDateString('en-US', options);
    const toDate = dateRange.to ? (dateRange.to as Date).toLocaleDateString('en-US', options) : fromDate;
    
    return `${fromDate} - ${toDate}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Business Impact ({getDateRangeDisplay()})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsMetricCard
            title="Revenue Influenced"
            value={`$${data.revenueInfluenced.toLocaleString()}`}
            icon={CircleDollarSign}
            iconColor="text-green-500"
            change={data.revenueInfluencedChange}
            backgroundColor="bg-green-50 dark:bg-green-950"
          />
          <AnalyticsMetricCard
            title="Member Value Diff"
            value={`$${data.memberValueDiff.toFixed(2)}`}
            icon={TrendingUp}
            iconColor="text-blue-500"
            change={data.memberValueChange}
            backgroundColor="bg-blue-50 dark:bg-blue-950"
          />
          <AnalyticsMetricCard
            title="Retention Impact"
            value={`${data.retentionImpact.toFixed(1)}%`}
            icon={Users}
            iconColor="text-purple-500"
            change={data.retentionImpactChange}
            backgroundColor="bg-purple-50 dark:bg-purple-950"
          />
          <AnalyticsMetricCard
            title="Redemption Efficiency"
            value={`${data.redemptionEfficiency.toFixed(1)}%`}
            icon={Award}
            iconColor="text-amber-500"
            change={data.redemptionEfficiencyChange}
            backgroundColor="bg-amber-50 dark:bg-amber-950"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Member vs Non-Member Value</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsBarChart
                title=""
                description=""
                height={250}
                data={data.memberValueComparison}
                series={[
                  { key: "memberValue", name: "Member Spend", color: "#8884d8" },
                  { key: "nonMemberValue", name: "Non-Member Spend", color: "#82ca9d" },
                ]}
                formatter={(value) => [`$${value}`, 'Avg Spend']}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Redemption Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsPieChart
                data={data.redemptionDistribution}
                height={250}
                formatter={(value) => `${value}%`}
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
