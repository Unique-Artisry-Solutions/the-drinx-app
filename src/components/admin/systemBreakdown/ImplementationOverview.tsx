
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureItem } from './types';
import { calculateFeatureStatistics } from './utils';

interface ImplementationOverviewProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
}

const ImplementationOverview: React.FC<ImplementationOverviewProps> = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures,
  promoterFeatures
}) => {
  // Calculate statistics
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);
  
  // Calculate totals
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const totalStats = calculateFeatureStatistics(allFeatures);
  
  // Count planned, in progress, implemented, and blocked features
  const totalPlanned = adminStats.plannedFeatures + establishmentStats.plannedFeatures + individualStats.plannedFeatures + promoterStats.plannedFeatures;
  const totalInProgress = adminStats.inProgressFeatures + establishmentStats.inProgressFeatures + individualStats.inProgressFeatures + promoterStats.inProgressFeatures;
  const totalImplemented = adminStats.implementedFeatures + establishmentStats.implementedFeatures + individualStats.implementedFeatures + promoterStats.implementedFeatures;
  const totalBlocked = adminStats.blockedFeatures + establishmentStats.blockedFeatures + individualStats.blockedFeatures + promoterStats.blockedFeatures;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Implementation Progress</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Admin Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(adminStats.averageImplementation)}%</div>
            <Progress value={adminStats.averageImplementation} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {adminStats.totalFeatures} features | {adminStats.implementedFeatures} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Establishment Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(establishmentStats.averageImplementation)}%</div>
            <Progress value={establishmentStats.averageImplementation} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {establishmentStats.totalFeatures} features | {establishmentStats.implementedFeatures} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Individual User Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(individualStats.averageImplementation)}%</div>
            <Progress value={individualStats.averageImplementation} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {individualStats.totalFeatures} features | {individualStats.implementedFeatures} completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Promoter Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(promoterStats.averageImplementation)}%</div>
            <Progress value={promoterStats.averageImplementation} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {promoterStats.totalFeatures} features | {promoterStats.implementedFeatures} completed
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-2">
            <div className="text-3xl font-bold">{Math.round(totalStats.averageImplementation)}%</div>
            <div className="ml-auto text-sm text-muted-foreground">
              {totalStats.totalFeatures} total features
            </div>
          </div>
          <Progress value={totalStats.averageImplementation} className="h-3 mb-4" />
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm font-medium">Planned</div>
              <div className="text-2xl font-bold mt-1 text-yellow-500">{totalPlanned}</div>
            </div>
            <div>
              <div className="text-sm font-medium">In Progress</div>
              <div className="text-2xl font-bold mt-1 text-blue-500">{totalInProgress}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Implemented</div>
              <div className="text-2xl font-bold mt-1 text-green-500">{totalImplemented}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Blocked</div>
              <div className="text-2xl font-bold mt-1 text-red-500">{totalBlocked}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImplementationOverview;
