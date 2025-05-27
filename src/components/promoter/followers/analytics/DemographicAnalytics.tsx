
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Users, MapPin, Calendar, Clock } from 'lucide-react';

interface DemographicData {
  ageGroups: Array<{ range: string; count: number; percentage: number; }>;
  genderDistribution: Array<{ gender: string; count: number; percentage: number; }>;
  locationData: Array<{ location: string; count: number; percentage: number; }>;
  joinedTimeline: Array<{ period: string; count: number; }>;
  preferences: Array<{ category: string; interest_level: number; count: number; }>;
}

interface DemographicAnalyticsProps {
  demographicData: DemographicData;
  totalFollowers: number;
}

const DemographicAnalytics: React.FC<DemographicAnalyticsProps> = ({
  demographicData,
  totalFollowers
}) => {
  const genderColors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
  const ageColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demographic Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {demographicData.ageGroups.reduce((max, group) => 
                  group.count > max.count ? group : max
                ).range}
              </div>
              <div className="text-sm text-muted-foreground">Top Age Group</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {demographicData.locationData[0]?.location || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Top Location</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {demographicData.genderDistribution[0]?.gender || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Primary Gender</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Age and Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicData.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} followers (${
                      demographicData.ageGroups.find(g => g.count === value)?.percentage || 0
                    }%)`, 'Count']}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData.genderDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="gender"
                    label={({ gender, percentage }) => `${gender} ${percentage}%`}
                  >
                    {demographicData.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={genderColors[index % genderColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} followers`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demographicData.locationData.slice(0, 8).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{location.location}</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-medium">{location.count}</div>
                    <div className="text-sm text-muted-foreground">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Follower Acquisition Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicData.joinedTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Interests & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicData.preferences} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="interest_level" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemographicAnalytics;
