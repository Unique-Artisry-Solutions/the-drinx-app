
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Package, 
  Target,
  CheckCircle 
} from 'lucide-react';
import type { EarlyWarning } from '@/services/predictiveAnalyticsService';

interface EarlyWarningPanelProps {
  warnings: EarlyWarning[];
  isLoading: boolean;
}

const EarlyWarningPanel: React.FC<EarlyWarningPanelProps> = ({
  warnings,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Early Warning System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'low_sales': return TrendingDown;
      case 'poor_engagement': return Users;
      case 'inventory_risk': return Package;
      case 'competition_threat': return Target;
      default: return AlertTriangle;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (warnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Early Warning System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <div className="text-lg font-medium text-green-600 mb-2">
              All Systems Running Smoothly
            </div>
            <div className="text-muted-foreground">
              No warnings or alerts detected for your events
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Early Warning System
          </div>
          <Badge variant="outline">
            {warnings.length} {warnings.length === 1 ? 'Alert' : 'Alerts'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {warnings.map((warning) => {
          const IconComponent = getWarningIcon(warning.type);
          
          return (
            <Alert key={warning.id} className="border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <IconComponent className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={getSeverityColor(warning.severity)}>
                      {warning.severity.toUpperCase()}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(warning.triggeredAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <AlertDescription className="mb-3">
                    {warning.message}
                  </AlertDescription>

                  {/* Metrics */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-medium">{warning.metrics.currentValue}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Threshold</div>
                        <div className="font-medium">{warning.metrics.threshold}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Trend</div>
                        <div className={`font-medium ${getTrendColor(warning.metrics.trend)}`}>
                          {warning.metrics.trend}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recommended Actions:</div>
                    <ul className="text-sm space-y-1">
                      {warning.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Event
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EarlyWarningPanel;
