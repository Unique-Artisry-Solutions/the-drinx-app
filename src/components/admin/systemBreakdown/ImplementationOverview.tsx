
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeatureItem } from './types';
import { calculateFeatureStatistics } from './utils';

interface ImplementationOverviewProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
}

const ImplementationOverview: React.FC<ImplementationOverviewProps> = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures 
}) => {
  const stats = calculateFeatureStatistics(adminFeatures, establishmentFeatures, individualFeatures);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Implementation Overview</CardTitle>
        <CardDescription>Current status of platform features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-2xl font-bold">{stats.totalFeatures}</div>
            <div className="text-sm text-gray-500">Total Features</div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-green-700">{stats.implementedFeatures}</div>
            <div className="text-sm text-gray-500">Implemented</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-orange-600">{stats.partialFeatures}</div>
            <div className="text-sm text-gray-500">Partial</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-blue-600">{stats.plannedFeatures}</div>
            <div className="text-sm text-gray-500">Planned</div>
          </div>
        </div>
        
        <div className="mt-4 mb-2 text-lg font-medium">Implementation Progress</div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Feature Implementation</span>
          <span className="text-sm font-medium">{stats.implementationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${stats.implementationRate}%` }}
          ></div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-green-700">{stats.dbCompleted}</div>
            <div className="text-sm text-gray-500">Database Complete</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-yellow-600">{stats.dbInProgress}</div>
            <div className="text-sm text-gray-500">Database In Progress</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-2xl font-bold text-gray-500">{stats.dbNotStarted}</div>
            <div className="text-sm text-gray-500">Database Not Started</div>
          </div>
        </div>
        
        <div className="mt-4 mb-1">
          <span className="text-sm font-medium">Database Completion</span>
          <span className="text-sm font-medium float-right">{stats.databaseCompletionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${stats.databaseCompletionRate}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationOverview;
