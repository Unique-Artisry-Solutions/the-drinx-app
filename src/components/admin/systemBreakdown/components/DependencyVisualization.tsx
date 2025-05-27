
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitBranch, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

interface DependencyVisualizationProps {
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
    critical: number;
  };
  technicalDebt: {
    score: number;
    items: number;
    estimated_hours: number;
  };
  changeImpact: {
    high: number;
    medium: number;
    low: number;
  };
}

const DependencyVisualization: React.FC<DependencyVisualizationProps> = ({
  dependencies,
  technicalDebt,
  changeImpact
}) => {
  return (
    <div className="space-y-6">
      {/* Dependencies Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Dependencies Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Dependencies</span>
              </div>
              <div className="text-2xl font-bold">{dependencies.total}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Outdated</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{dependencies.outdated}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Vulnerable</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{dependencies.vulnerable}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{dependencies.critical}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Debt */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Debt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Health Score</span>
              </div>
              <Progress value={technicalDebt.score} className="h-2" />
              <span className="text-sm text-muted-foreground">{technicalDebt.score}/100</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Debt Items</span>
              <div className="text-2xl font-bold">{technicalDebt.items}</div>
              <Badge variant="outline">Issues to resolve</Badge>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Estimated Work</span>
              <div className="text-2xl font-bold">{technicalDebt.estimated_hours}h</div>
              <Badge variant="outline">Hours needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Change Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High Impact Changes</span>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{changeImpact.high}</Badge>
                <Progress value={(changeImpact.high / (changeImpact.high + changeImpact.medium + changeImpact.low)) * 100} className="w-32 h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Medium Impact Changes</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{changeImpact.medium}</Badge>
                <Progress value={(changeImpact.medium / (changeImpact.high + changeImpact.medium + changeImpact.low)) * 100} className="w-32 h-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Low Impact Changes</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{changeImpact.low}</Badge>
                <Progress value={(changeImpact.low / (changeImpact.high + changeImpact.medium + changeImpact.low)) * 100} className="w-32 h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DependencyVisualization;
