
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FeatureItem } from './types';
import DevelopmentProgressDashboard from './DevelopmentProgressDashboard';
import { useFeatureStatus } from './hooks/useFeatureStatus';

const OverviewTab: React.FC = () => {
  const {
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    updatedFeaturesCount
  } = useFeatureStatus();

  // Combine all features for overall statistics
  const allFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ];

  // Calculate overall statistics
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const inProgressFeatures = allFeatures.filter(f => f.status === 'in_progress').length;
  const notStartedFeatures = allFeatures.filter(f => f.status === 'not_started').length;

  const overallProgress = totalFeatures > 0 ? Math.round((implementedFeatures / totalFeatures) * 100) : 0;

  // Mock data for progress tracking
  const currentSnapshot = {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    totalFeatures,
    implementedFeatures,
    inProgressFeatures,
    plannedFeatures: notStartedFeatures,
    blockedFeatures: 0,
    averageImplementationProgress: Math.round(
      allFeatures.reduce((sum, f) => sum + (f.implementationProgress || 0), 0) / totalFeatures
    ),
    frontendProgress: 85,
    backendProgress: 90,
    adminFeatureCount: adminFeatures.length,
    establishmentFeatureCount: establishmentFeatures.length,
    individualFeatureCount: individualFeatures.length,
    promoterFeatureCount: promoterFeatures.length,
    adminImplementationRate: Math.round((adminFeatures.filter(f => f.status === 'implemented').length / adminFeatures.length) * 100),
    establishmentImplementationRate: Math.round((establishmentFeatures.filter(f => f.status === 'implemented').length / establishmentFeatures.length) * 100),
    individualImplementationRate: Math.round((individualFeatures.filter(f => f.status === 'implemented').length / individualFeatures.length) * 100),
    promoterImplementationRate: Math.round((promoterFeatures.filter(f => f.status === 'implemented').length / promoterFeatures.length) * 100),
    overallProgress,
    dbComplete: 92,
    confidenceScore: 95
  };

  const monthlyProgressData = [
    { month: 'Jan', frontend: 45, backend: 50 },
    { month: 'Feb', frontend: 55, backend: 60 },
    { month: 'Mar', frontend: 70, backend: 75 },
    { month: 'Apr', frontend: 80, backend: 85 },
    { month: 'May', frontend: 85, backend: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeatures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{implementedFeatures}</div>
            <div className="text-xs text-muted-foreground">{Math.round((implementedFeatures / totalFeatures) * 100)}% complete</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressFeatures}</div>
            <div className="text-xs text-muted-foreground">{Math.round((inProgressFeatures / totalFeatures) * 100)}% of total</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admin Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{adminFeatures.length}</div>
            <Badge variant="outline" className="mt-1">
              {adminFeatures.filter(f => f.status === 'implemented').length} implemented
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Establishment Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{establishmentFeatures.length}</div>
            <Badge variant="outline" className="mt-1">
              {establishmentFeatures.filter(f => f.status === 'implemented').length} implemented
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Individual Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{individualFeatures.length}</div>
            <Badge variant="outline" className="mt-1">
              {individualFeatures.filter(f => f.status === 'implemented').length} implemented
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promoter Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{promoterFeatures.length}</div>
            <Badge variant="outline" className="mt-1">
              {promoterFeatures.filter(f => f.status === 'implemented').length} implemented
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Dashboard */}
      <DevelopmentProgressDashboard
        features={allFeatures}
      />

      {/* Recent Updates */}
      {updatedFeaturesCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {updatedFeaturesCount} features have been recently updated with new status information.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
