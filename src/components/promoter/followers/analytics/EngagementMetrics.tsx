
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Activity, MessageSquare, Heart, Share2, Eye } from 'lucide-react';

interface EngagementData {
  contentType: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

interface ContentPerformance {
  title: string;
  type: 'event' | 'promotion' | 'general';
  engagementScore: number;
  reach: number;
  clicks: number;
}

interface EngagementMetricsProps {
  engagementData: EngagementData[];
  topContent: ContentPerformance[];
  totalEngagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    averageEngagementRate: number;
  };
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  engagementData,
  topContent,
  totalEngagement
}) => {
  const pieData = engagementData.map((item, index) => ({
    name: item.contentType,
    value: item.views,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Total Views</div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalEngagement.views.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium">Total Likes</div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalEngagement.likes.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Comments</div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalEngagement.comments.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Avg. Engagement</div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalEngagement.averageEngagementRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement by Content Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Content Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="contentType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3B82F6" name="Views" />
                  <Bar dataKey="likes" fill="#10B981" name="Likes" />
                  <Bar dataKey="comments" fill="#F59E0B" name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{content.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="capitalize">{content.type}</span>
                    <span>•</span>
                    <span>{content.reach.toLocaleString()} reach</span>
                    <span>•</span>
                    <span>{content.clicks.toLocaleString()} clicks</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{content.engagementScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementMetrics;
