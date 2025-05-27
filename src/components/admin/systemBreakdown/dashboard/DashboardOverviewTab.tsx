
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Activity, CheckCircle } from 'lucide-react';

interface DashboardOverviewTabProps {
  adminFeatures: any[];
  establishmentFeatures: any[];
  individualFeatures: any[];
  promoterFeatures: any[];
  progressHistory: any[];
  monthlyProgressData: any[];
  currentSnapshot: any;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  progressHistory,
  monthlyProgressData,
  currentSnapshot
}) => {
  const totalFeatures = adminFeatures.length + establishmentFeatures.length + 
                       individualFeatures.length + promoterFeatures.length;
  
  const implementedFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ].filter(feature => feature.status === 'implemented').length;

  const completionRate = totalFeatures > 0 ? (implementedFeatures / totalFeatures) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Total Features</div>
            </div>
            <div className="text-2xl font-bold mt-1">{totalFeatures}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Implemented</div>
            </div>
            <div className="text-2xl font-bold mt-1">{implementedFeatures}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Completion Rate</div>
            </div>
            <div className="text-2xl font-bold mt-1">{completionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">User Types</div>
            </div>
            <div className="text-2xl font-bold mt-1">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Categories Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold text-blue-600">Admin Features</div>
              <div className="text-2xl font-bold">{adminFeatures.length}</div>
              <Badge variant="outline" className="mt-2">
                {adminFeatures.filter(f => f.status === 'implemented').length} implemented
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold text-green-600">Establishment Features</div>
              <div className="text-2xl font-bold">{establishmentFeatures.length}</div>
              <Badge variant="outline" className="mt-2">
                {establishmentFeatures.filter(f => f.status === 'implemented').length} implemented
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold text-purple-600">Individual Features</div>
              <div className="text-2xl font-bold">{individualFeatures.length}</div>
              <Badge variant="outline" className="mt-2">
                {individualFeatures.filter(f => f.status === 'implemented').length} implemented
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold text-orange-600">Promoter Features</div>
              <div className="text-2xl font-bold">{promoterFeatures.length}</div>
              <Badge variant="outline" className="mt-2">
                {promoterFeatures.filter(f => f.status === 'implemented').length} implemented
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <div className="text-sm text-muted-foreground">Overall System Status</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
