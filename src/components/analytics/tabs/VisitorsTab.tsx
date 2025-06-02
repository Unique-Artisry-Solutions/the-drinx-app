
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';
import { Clock, Users, Map, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const RADIAN = Math.PI / 180;

// Mock data for demographics until we have real data
const mockAgeData = [
  { name: '18-24', value: 30 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 15 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 5 },
];

const mockGenderData = [
  { name: 'Male', value: 48 },
  { name: 'Female', value: 45 },
  { name: 'Non-binary', value: 5 },
  { name: 'Other', value: 2 },
];

// Mock data for visit duration
const mockVisitDurationData = [
  { name: '< 30 min', visits: 25 },
  { name: '30-60 min', visits: 40 },
  { name: '1-2 hours', visits: 30 },
  { name: '2+ hours', visits: 5 },
];

// Mock data for peak hours
const generatePeakHoursData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    // Create a natural curve with peak during evening hours
    let value;
    if (i < 6) value = Math.floor(Math.random() * 5); // Early morning (low)
    else if (i < 11) value = 5 + Math.floor(Math.random() * 15); // Morning (medium)
    else if (i < 14) value = 15 + Math.floor(Math.random() * 20); // Lunch (high)
    else if (i < 17) value = 10 + Math.floor(Math.random() * 15); // Afternoon (medium)
    else if (i < 22) value = 20 + Math.floor(Math.random() * 30); // Evening (highest)
    else value = 5 + Math.floor(Math.random() * 15); // Late night (medium-low)
    
    return {
      hour: `${i}:00`,
      visitors: value
    };
  });
};

const mockPeakHoursData = generatePeakHoursData();

// Custom label for pie charts
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface VisitorsTabProps {
  formattedVisitorData: Array<{
    name: string;
    visitors: number;
    returningVisitors: number;
    uniqueVisitors: number;
  }>;
}

export const VisitorsTab: React.FC<VisitorsTabProps> = ({
  formattedVisitorData
}) => {
  // Check if we have enough data for visualizations
  const hasVisitorData = formattedVisitorData && formattedVisitorData.length > 0;
  
  // Calculate retention rate for each day
  const retentionRateData = React.useMemo(() => {
    if (!hasVisitorData) return [];
    
    return formattedVisitorData.map(day => ({
      name: day.name,
      retentionRate: day.visitors > 0 
        ? Math.round((day.returningVisitors / day.visitors) * 100) 
        : 0
    }));
  }, [formattedVisitorData, hasVisitorData]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Visitor Demographics - Age
            </CardTitle>
            <CardDescription>
              Age distribution of your establishment visitors
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={mockAgeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {mockAgeData.map((entry, index) => (
                      <Cell key={`cell-age-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} visitors`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Visitor Demographics - Gender
            </CardTitle>
            <CardDescription>
              Gender distribution of your establishment visitors
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={mockGenderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {mockGenderData.map((entry, index) => (
                      <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} visitors`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Visit Duration Analysis
            </CardTitle>
            <CardDescription>
              How long visitors typically stay at your establishment
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockVisitDurationData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} visits`, 'Count']} />
                  <Bar dataKey="visits" fill="#8884d8" name="Visit Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Peak Hours Analysis
            </CardTitle>
            <CardDescription>
              When your establishment sees the most visitor traffic
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockPeakHoursData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(value) => value}
                    interval={2}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} visitors`, 'Count']} />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Visitor Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Returning Visitor Rate
          </CardTitle>
          <CardDescription>
            Percentage of visitors who are returning to your establishment
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={retentionRateData}
                margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="retentionRate"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={{ stroke: '#0088FE', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                  name="Retention Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
