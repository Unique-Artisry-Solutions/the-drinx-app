
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity, Users } from 'lucide-react';

interface DashboardAnalyticsTabProps {
  adminFeatures: any[];
  establishmentFeatures: any[];
  individualFeatures: any[];
  promoterFeatures: any[];
  progressHistory: any[];
  monthlyProgressData: any[];
}

export const DashboardAnalyticsTab: React.FC<DashboardAnalyticsTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  progressHistory,
  monthlyProgressData
}) => {
  // Calculate analytics metrics
  const totalFeatures = adminFeatures.length + establishmentFeatures.length + 
                       individualFeatures.length + promoterFeatures.length;
  
  const recentProgress = progressHistory.slice(-30); // Last 30 entries
  const monthlyGrowth = monthlyProgressData.length > 1 
    ? ((monthlyProgressData[monthlyProgressData.length - 1]?.total || 0) - 
       (monthlyProgressData[monthlyProgressData.length - 2]?.total || 0)) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Analytics</h2>
          <p className="text-muted-foreground">
            Detailed analytics and insights into system performance and feature implementation
          </p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Implementation Velocity</div>
            </div>
            <div className="text-2xl font-bold mt-1">{recentProgress.length}</div>
            <div className="text-xs text-muted-foreground">Features/month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Monthly Growth</div>
            </div>
            <div className="text-2xl font-bold mt-1">+{monthlyGrowth}</div>
            <div className="text-xs text-muted-foreground">New features</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Active Development</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {[...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures]
                .filter(f => f.status === 'in-progress').length}
            </div>
            <div className="text-xs text-muted-foreground">In progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Coverage</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {((totalFeatures / 100) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Feature coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Features</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(adminFeatures.length / totalFeatures) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">{adminFeatures.length}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Establishment Features</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(establishmentFeatures.length / totalFeatures) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">{establishmentFeatures.length}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Individual Features</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(individualFeatures.length / totalFeatures) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">{individualFeatures.length}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Promoter Features</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(promoterFeatures.length / totalFeatures) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">{promoterFeatures.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Timeline visualization would appear here</p>
            <p className="text-sm">Showing progress over time for {progressHistory.length} data points</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
