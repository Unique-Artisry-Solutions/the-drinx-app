
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  AlertTriangle, 
  Clock, 
  Target,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

interface Dependency {
  id: string;
  name: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  status: 'completed' | 'in_progress' | 'blocked' | 'pending';
  dependsOn: string[];
  blockedBy: string[];
  estimatedCompletion: string;
  riskLevel: number;
}

interface TechnicalDebtItem {
  id: string;
  area: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  effort: number;
  impact: number;
  description: string;
}

interface DependencyVisualizationProps {
  dependencies: Dependency[];
  technicalDebt: TechnicalDebtItem[];
  changeImpact: {
    affectedFeatures: number;
    riskScore: number;
    testCoverage: number;
    rollbackPlan: boolean;
  };
}

const DependencyVisualization: React.FC<DependencyVisualizationProps> = ({
  dependencies,
  technicalDebt,
  changeImpact
}) => {
  const getDependencyStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const blockedDependencies = dependencies.filter(d => d.status === 'blocked').length;
  const criticalPath = dependencies.filter(d => d.type === 'critical').length;
  const highRiskItems = dependencies.filter(d => d.riskLevel > 7).length;

  return (
    <div className="space-y-6">
      {/* Dependency Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Dependency Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Dependencies</CardTitle>
                <GitBranch className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dependencies.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active dependencies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Blocked Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{blockedDependencies}</div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Critical Path</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{criticalPath}</div>
              <p className="text-xs text-muted-foreground mt-1">High priority items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <Shield className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{highRiskItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Risk score &gt; 7</p>
            </CardContent>
          </Card>
        </div>

        {/* Dependency List */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dependencies.slice(0, 5).map((dep) => (
                <div key={dep.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{dep.name}</h4>
                      <Badge className={getDependencyStatusColor(dep.status)}>
                        {dep.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getTypeColor(dep.type)}`}>
                        {dep.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Risk: {dep.riskLevel}/10
                      </span>
                    </div>
                  </div>
                  
                  {dep.dependsOn.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>Depends on:</span>
                      <div className="flex items-center gap-1">
                        {dep.dependsOn.slice(0, 3).map((depId, index) => (
                          <React.Fragment key={depId}>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {depId}
                            </span>
                            {index < Math.min(dep.dependsOn.length, 3) - 1 && (
                              <ArrowRight className="h-3 w-3" />
                            )}
                          </React.Fragment>
                        ))}
                        {dep.dependsOn.length > 3 && (
                          <span className="text-xs">+{dep.dependsOn.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Est. completion: {dep.estimatedCompletion}
                    </span>
                    {dep.blockedBy.length > 0 && (
                      <span className="text-red-600">
                        Blocked by {dep.blockedBy.length} item(s)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Debt Tracking */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Technical Debt Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Debt Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalDebt.slice(0, 4).map((debt) => (
                  <div key={debt.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{debt.area}</h4>
                      {getSeverityBadge(debt.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{debt.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Effort:</span>
                        <Progress value={debt.effort * 10} className="mt-1" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact:</span>
                        <Progress value={debt.impact * 10} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Affected Features</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{changeImpact.affectedFeatures}</span>
                    <Zap className="h-4 w-4 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Score</span>
                    <span className="text-sm font-medium">{changeImpact.riskScore}/10</span>
                  </div>
                  <Progress value={changeImpact.riskScore * 10} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Test Coverage</span>
                    <span className="text-sm font-medium">{changeImpact.testCoverage}%</span>
                  </div>
                  <Progress value={changeImpact.testCoverage} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Rollback Plan</span>
                  <Badge className={changeImpact.rollbackPlan ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {changeImpact.rollbackPlan ? 'Ready' : 'Missing'}
                  </Badge>
                </div>

                {changeImpact.riskScore > 7 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-red-800 text-sm font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      High Risk Change Detected
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This change has a high risk score. Consider additional testing and staged rollout.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DependencyVisualization;
