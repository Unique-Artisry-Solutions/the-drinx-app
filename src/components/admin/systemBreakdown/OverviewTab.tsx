
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Database, Users } from 'lucide-react';
import AnalysisProgress from './AnalysisProgress';
import StatusUpdateNotification from './StatusUpdateNotification';
import DevelopmentProgressDashboard from './DevelopmentProgressDashboard';
import CreateReleaseFromFeaturesButton from './CreateReleaseFromFeaturesButton';
import { FeatureItem, AnalysisStep, ProgressSnapshot, MonthlyProgressData } from './types';
import { calculateFeatureStatistics } from './utils';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  analyzing: boolean;
  analysisProgress: number;
  analysisSteps: AnalysisStep[];
  updatedFeaturesCount: number;
  onCreateRelease: () => void;
  progressHistory?: ProgressSnapshot[];
  monthlyProgressData?: MonthlyProgressData[];
  currentSnapshot?: ProgressSnapshot | null;
  dataValidation?: { isValid: boolean; issues: string[] };
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  analyzing,
  analysisProgress,
  analysisSteps,
  updatedFeaturesCount,
  onCreateRelease,
  progressHistory = [],
  monthlyProgressData = [],
  currentSnapshot,
  dataValidation
}) => {
  console.log('OverviewTab: Rendering with features:', {
    admin: adminFeatures.length,
    establishment: establishmentFeatures.length,
    individual: individualFeatures.length,
    promoter: promoterFeatures.length
  });

  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const stats = calculateFeatureStatistics(allFeatures);

  const implementedCount = allFeatures.filter(f => f.status === 'implemented').length;
  const inProgressCount = allFeatures.filter(f => f.status === 'in_progress').length;
  const plannedCount = allFeatures.filter(f => f.status === 'planned').length;
  const overallProgress = (implementedCount / allFeatures.length) * 100;

  return (
    <div className="space-y-6">
      {/* Analysis Progress */}
      {analyzing && (
        <AnalysisProgress 
          progress={analysisProgress}
          steps={analysisSteps}
        />
      )}

      {/* Status Update Notification */}
      {updatedFeaturesCount > 0 && (
        <StatusUpdateNotification count={updatedFeaturesCount} />
      )}

      {/* Data Validation Warning */}
      {dataValidation && !dataValidation.isValid && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Data Validation Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-orange-700">
              {dataValidation.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all user types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{implementedCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((implementedCount / allFeatures.length) * 100)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently developing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{plannedCount}</div>
            <p className="text-xs text-muted-foreground">
              Future development
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Implementation Progress
            <Badge variant="outline">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{implementedCount} implemented</span>
            <span>{allFeatures.length} total features</span>
          </div>
        </CardContent>
      </Card>

      {/* Development Progress Dashboard */}
      {currentSnapshot && (
        <DevelopmentProgressDashboard
          currentSnapshot={currentSnapshot}
          monthlyProgressData={monthlyProgressData}
          progressHistory={progressHistory}
        />
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <CreateReleaseFromFeaturesButton 
            onClick={onCreateRelease}
            featuresReady={allFeatures.filter(f => f.status === 'implemented').length}
          />
          <Button variant="outline">
            View Analytics
          </Button>
          <Button variant="outline">
            Export Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
