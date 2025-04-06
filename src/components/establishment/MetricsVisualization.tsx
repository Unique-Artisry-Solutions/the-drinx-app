
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowUpRight, TrendingUp, Users, Star, BarChartIcon, CakeSlice, Route } from 'lucide-react';

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
  barCrawlData?: {
    name: string;
    value: number;
    color: string;
  }[];
}

const MetricsVisualization: React.FC<MetricsVisualizationProps> = ({ 
  returningRate, 
  visitorData, 
  ratingData,
  mocktailData = [],
  barCrawlData = [] 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="vibrant-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-spiritless-pink" />
            Return Rate Trend
          </CardTitle>
          <CardDescription>
            Percentage of customers who return to your establishment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between mb-2">
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
          
          <div className="h-[160px] w-full">
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
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} width={25} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{fontSize: '10px', marginTop: '-10px'}} />
                <Line
                  type="monotone"
                  dataKey="returningVisitors"
                  stroke="var(--color-returningVisitors)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="vibrant-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Rating Performance
          </CardTitle>
          <CardDescription>
            Customer satisfaction rating over time
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between mb-2">
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
          
          <div className="h-[160px] w-full">
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
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis domain={[0, 5]} tick={{fontSize: 10}} width={25} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{fontSize: '10px', marginTop: '-10px'}} />
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
      
      <Card className="vibrant-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CakeSlice className="mr-2 h-5 w-5 text-blue-500" />
            Mocktail Popularity
          </CardTitle>
          <CardDescription>
            Distribution of mocktail orders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-3xl font-bold">{mocktailData.reduce((sum, item) => sum + item.orders, 0)}</p>
              <p className="text-xs text-material-on-surface-variant">
                total mocktail orders
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {mocktailData.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-[160px] w-full flex justify-center">
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
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={mocktailData}
                  dataKey="orders"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={30}
                  paddingAngle={2}
                  label={({name}) => name.substring(0, 6) + '...'}
                  labelLine={false}
                >
                  {mocktailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{fontSize: '10px', marginTop: '0px'}} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="vibrant-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Route className="mr-2 h-5 w-5 text-purple-500" />
            Bar Crawl Participation
          </CardTitle>
          <CardDescription>
            Bar crawls featuring your establishment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-3xl font-bold">{barCrawlData.reduce((sum, item) => sum + item.value, 0)}</p>
              <p className="text-xs text-material-on-surface-variant">
                total bar crawl participants
              </p>
            </div>
            <div className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-sm flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              14% increase
            </div>
          </div>
          
          <div className="h-[160px] w-full">
            <ChartContainer
              config={
                barCrawlData.reduce((config, item) => ({
                  ...config,
                  [item.name]: {
                    label: item.name,
                    color: item.color,
                  },
                }), {})
              }
            >
              <BarChart
                data={barCrawlData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} width={25} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{fontSize: '10px', marginTop: '-10px'}} />
                <Bar dataKey="value" barSize={20}>
                  {barCrawlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsVisualization;
