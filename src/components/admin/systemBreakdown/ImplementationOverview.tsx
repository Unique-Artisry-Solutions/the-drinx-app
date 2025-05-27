
import React from 'react';
import { FeatureItem } from './types';
import { calculateFeatureStatistics } from './utils/featureStatistics';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ImplementationStats } from './components/dashboard/ImplementationStats';
import { CategoryMetrics } from './components/dashboard/CategoryMetrics';

interface ImplementationOverviewProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
}

export const ImplementationOverview: React.FC<ImplementationOverviewProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures
}) => {
  // Calculate overall statistics
  const allFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ];
  
  const stats = calculateFeatureStatistics(allFeatures);
  
  // Calculate individual user type statistics
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);

  return (
    <div className="space-y-6">
      {/* Header with overall progress */}
      <DashboardHeader 
        overallProgressPercentage={stats.implementationRate}
        confidenceScore={stats.confidenceScore}
      />

      {/* Implementation statistics */}
      <ImplementationStats
        implementedFeatures={stats.implementedFeatures}
        partialFeatures={stats.inProgressFeatures}
        plannedFeatures={stats.plannedFeatures}
        blockedFeatures={stats.blockedFeatures}
        totalFeatures={stats.totalFeatures}
      />

      {/* Category breakdown */}
      <CategoryMetrics
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        promoterFeatures={promoterFeatures}
      />

      {/* Feature Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Admin Features Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Features</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{adminFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Implemented:</span>
              <span className="font-medium text-green-600">{adminStats.implementedFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium text-yellow-600">{adminStats.inProgressFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planned:</span>
              <span className="font-medium text-blue-600">{adminStats.plannedFeatures}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{Math.round(adminStats.implementationRate)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Establishment Features Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Establishment Features</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{establishmentFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Implemented:</span>
              <span className="font-medium text-green-600">{establishmentStats.implementedFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium text-yellow-600">{establishmentStats.inProgressFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planned:</span>
              <span className="font-medium text-blue-600">{establishmentStats.plannedFeatures}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{Math.round(establishmentStats.implementationRate)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Features Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Features</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{individualFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Implemented:</span>
              <span className="font-medium text-green-600">{individualStats.implementedFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium text-yellow-600">{individualStats.inProgressFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planned:</span>
              <span className="font-medium text-blue-600">{individualStats.plannedFeatures}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{Math.round(individualStats.implementationRate)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promoter Features Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Promoter Features</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{promoterFeatures.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Implemented:</span>
              <span className="font-medium text-green-600">{promoterStats.implementedFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress:</span>
              <span className="font-medium text-yellow-600">{promoterStats.inProgressFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Planned:</span>
              <span className="font-medium text-blue-600">{promoterStats.plannedFeatures}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium">{Math.round(promoterStats.implementationRate)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database and Technical Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Implementation</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">DB Complete:</span>
              <span className="font-medium">{stats.dbCompleted} features</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DB Progress:</span>
              <span className="font-medium">{Math.round(stats.dbCompletionRate)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${stats.dbCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend Implementation</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Frontend Progress:</span>
              <span className="font-medium">{Math.round(stats.frontendImplementationRate)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Implementation:</span>
              <span className="font-medium">{Math.round(stats.averageImplementation)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${stats.frontendImplementationRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
