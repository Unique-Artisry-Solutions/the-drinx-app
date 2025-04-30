
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingUp, Users, ChartBar } from "lucide-react";
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { DateRange } from "react-day-picker";
import { BusinessImpactData } from '@/lib/rewards/types';

interface BusinessImpactSectionProps {
  data: BusinessImpactData;
  dateRange: DateRange;
}

export default function BusinessImpactSection({ data, dateRange }: BusinessImpactSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Revenue Influenced"
          value={`$${data.revenueInfluenced.toLocaleString()}`}
          icon={CircleDollarSign}
          iconColor="text-emerald-500"
          change={data.revenueInfluencedChange}
          backgroundColor="bg-emerald-50 dark:bg-emerald-950"
        />
        <AnalyticsMetricCard
          title="Member Value"
          value={`$${data.memberValueDiff.toLocaleString()}`}
          icon={Users}
          iconColor="text-indigo-500"
          change={data.memberValueChange}
          backgroundColor="bg-indigo-50 dark:bg-indigo-950"
        />
        <AnalyticsMetricCard
          title="Retention Impact"
          value={`${data.retentionImpact.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-cyan-500"
          change={data.retentionImpactChange}
          backgroundColor="bg-cyan-50 dark:bg-cyan-950"
        />
        <AnalyticsMetricCard
          title="Redemption Efficiency"
          value={`${data.redemptionEfficiency.toFixed(1)}%`}
          icon={ChartBar}
          iconColor="text-rose-500"
          change={data.redemptionEfficiencyChange}
          backgroundColor="bg-rose-50 dark:bg-rose-950"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member vs Non-Member Value</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              title=""
              description=""
              height={300}
              data={data.memberValueComparison}
              series={[
                { key: "memberValue", name: "Program Members", color: "#8884d8" },
                { key: "nonMemberValue", name: "Non-Members", color: "#82ca9d" },
              ]}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Average Value']}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reward Redemption Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart
              title=""
              description=""
              height={300}
              data={data.redemptionDistribution}
              colors={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1']}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
