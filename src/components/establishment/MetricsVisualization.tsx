
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowUpRight, TrendingUp, Users, Star } from 'lucide-react';

interface MetricsVisualizationProps {
  returningRate: number;
  visitorData: {
    name: string;
    visitors: number;
    returningVisitors: number;
  }[];
  ratingData: {
    name: string;
    rating: number;
  }[];
}

const MetricsVisualization: React.FC<MetricsVisualizationProps> = ({ 
  returningRate, 
  visitorData, 
  ratingData 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <Card className="vibrant-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-spiritless-pink" />
            Return Rate Trend
          </CardTitle>
          <CardDescription>
            Percentage of customers who return to your establishment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{returningRate}%</p>
              <p className="text-xs text-material-on-surface-variant">
                overall return rate
              </p>
            </div>
            <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-sm flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              5.2% increase
            </div>
          </div>
          
          <div className="h-[200px]">
            <ChartContainer
              config={{
                returningVisitors: {
                  label: "Returning Visitors",
                  color: "#ec4899",
                },
                visitors: {
                  label: "Total Visitors",
                  color: "#8b5cf6",
                },
              }}
            >
              <LineChart
                data={visitorData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="returningVisitors"
                  stroke="var(--color-returningVisitors)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="vibrant-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Rating Performance
          </CardTitle>
          <CardDescription>
            Customer satisfaction rating over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">4.7<span className="text-lg font-normal">/5</span></p>
              <p className="text-xs text-material-on-surface-variant">
                average customer rating
              </p>
            </div>
            <div className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-sm flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              0.3 points up
            </div>
          </div>
          
          <div className="h-[200px]">
            <ChartContainer
              config={{
                rating: {
                  label: "Average Rating",
                  color: "#eab308",
                },
              }}
            >
              <BarChart
                data={ratingData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="rating"
                  fill="var(--color-rating)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsVisualization;
