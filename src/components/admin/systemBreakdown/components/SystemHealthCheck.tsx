
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ProgressSnapshot } from '../types';

interface SystemHealthCheckProps {
  dataValidation: { isValid: boolean; issues: string[] };
  currentSnapshot: ProgressSnapshot | null;
}

const SystemHealthCheck: React.FC<SystemHealthCheckProps> = ({ 
  dataValidation, 
  currentSnapshot 
}) => {
  // Calculate overall health status
  const hasSnapshot = !!currentSnapshot;
  const isDataValid = dataValidation.isValid;
  
  // Define health checks
  const healthChecks = [
    {
      name: 'Data Validation',
      status: isDataValid ? 'healthy' : 'warning',
      details: isDataValid ? 'All data is valid' : `${dataValidation.issues.length} validation issues found`
    },
    {
      name: 'Progress Tracking',
      status: hasSnapshot ? 'healthy' : 'critical',
      details: hasSnapshot ? 'Progress snapshot available' : 'No progress snapshot available'
    },
    {
      name: 'Database Status Tracking',
      status: hasSnapshot && (currentSnapshot?.dbComplete || 0) > 0 ? 'healthy' : 'warning',
      details: hasSnapshot ? `${currentSnapshot?.dbComplete || 0} database implementations tracked` : 'Database tracking incomplete'
    },
    {
      name: 'Feature Implementation',
      status: hasSnapshot && currentSnapshot?.implementedFeatures > 0 ? 'healthy' : 'warning',
      details: hasSnapshot ? `${currentSnapshot?.implementedFeatures} features implemented` : 'No implemented features detected'
    }
  ];

  // Get overall status
  const getOverallStatus = () => {
    if (healthChecks.some(check => check.status === 'critical')) {
      return 'critical';
    }
    if (healthChecks.some(check => check.status === 'warning')) {
      return 'warning';
    }
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1 font-medium">
            <CheckCircle className="h-3 w-3" />
            Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1 font-medium">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        );
      case 'critical':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1 font-medium">
            <XCircle className="h-3 w-3" />
            Critical
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 flex items-center gap-1 font-medium">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>System Health Check</CardTitle>
          {renderStatusBadge(overallStatus)}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
              <div>
                <span>{check.name}</span>
                <p className="text-sm text-gray-500">{check.details}</p>
              </div>
              {renderStatusBadge(check.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCheck;
