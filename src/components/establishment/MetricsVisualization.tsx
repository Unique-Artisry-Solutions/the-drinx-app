
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowUpRight, TrendingUp, Users, Star, BarChart as BarChartIcon } from 'lucide-react';

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
  mocktailData?: {
    name: string;
    orders: number;
    color: string;
  }[];
}

const MetricsVisualization: React.FC<MetricsVisualizationProps> = ({ 
  returningRate, 
  visitorData, 
  ratingData,
  mocktailData = [] 
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
      
      {mocktailData.length > 0 && (
        <Card className="vibrant-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChartIcon className="mr-2 h-5 w-5 text-blue-500" />
              Mocktail Popularity
            </CardTitle>
            <CardDescription>
              Distribution of mocktail orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">{mocktailData.reduce((sum, item) => sum + item.orders, 0)}</p>
                <p className="text-xs text-material-on-surface-variant">
                  total mocktail orders
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 md:mt-0">
                {mocktailData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[250px]">
                <ChartContainer
                  config={
                    mocktailData.reduce((config, item) => ({
                      ...config,
                      [item.name]: {
                        label: item.name,
                        color: item.color,
                      },
                    }), {})
                  }
                >
                  <BarChart
                    data={mocktailData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="orders" barSize={30}>
                      {mocktailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={
                    mocktailData.reduce((config, item) => ({
                      ...config,
                      [item.name]: {
                        label: item.name,
                        color: item.color,
                      },
                    }), {})
                  }
                >
                  <PieChart>
                    <Pie
                      data={mocktailData}
                      dataKey="orders"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                      label={(entry) => entry.name}
                    >
                      {mocktailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetricsVisualization;
