
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart } from 'lucide-react';
import { FeatureItem } from './types';
import SystemHealthCheck from './components/SystemHealthCheck';
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
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  
  // Calculate feature statistics
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);

  // Combine all features for overall statistics
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const overallStats = calculateFeatureStatistics(allFeatures);
  
  // Get feature counts by status
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const inProgressFeatures = allFeatures.filter(f => f.status === 'in_progress').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  const blockedFeatures = allFeatures.filter(f => f.status === 'blocked').length;
  
  // Calculate percentages for the progress bars
  const implementedPercentage = Math.round((implementedFeatures / totalFeatures) * 100);
  const partialPercentage = Math.round((partialFeatures / totalFeatures) * 100);
  const inProgressPercentage = Math.round((inProgressFeatures / totalFeatures) * 100);
  const plannedPercentage = Math.round((plannedFeatures / totalFeatures) * 100);
  const blockedPercentage = Math.round((blockedFeatures / totalFeatures) * 100);

  // Render bar chart with basic CSS
  const renderBarChart = () => (
    <div className="mt-6">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Implemented ({implementedFeatures})</span>
            <span>{implementedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${implementedPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Partial ({partialFeatures})</span>
            <span>{partialPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${partialPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>In Progress ({inProgressFeatures})</span>
            <span>{inProgressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${inProgressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Planned ({plannedFeatures})</span>
            <span>{plannedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${plannedPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {blockedFeatures > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Blocked ({blockedFeatures})</span>
              <span>{blockedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${blockedPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-lg font-medium">{adminFeatures.length}</div>
          <div className="text-sm text-gray-600">Admin Features</div>
          <div className="text-xs mt-2">
            {Math.round(adminStats.averageImplementation)}% implemented
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-lg font-medium">{establishmentFeatures.length}</div>
          <div className="text-sm text-gray-600">Establishment Features</div>
          <div className="text-xs mt-2">
            {Math.round(establishmentStats.averageImplementation)}% implemented
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-lg font-medium">{individualFeatures.length}</div>
          <div className="text-sm text-gray-600">Individual Features</div>
          <div className="text-xs mt-2">
            {Math.round(individualStats.averageImplementation)}% implemented
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-lg font-medium">{promoterFeatures.length}</div>
          <div className="text-sm text-gray-600">Promoter Features</div>
          <div className="text-xs mt-2">
            {Math.round(promoterStats.averageImplementation)}% implemented
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Feature Implementation Overview</CardTitle>
        <Tabs
          defaultValue="bar"
          value={chartType}
          onValueChange={(value) => setChartType(value as 'bar' | 'pie' | 'line')}
          className="w-fit"
        >
          <TabsList className="grid grid-cols-3 h-8 w-fit">
            <TabsTrigger value="bar" className="px-3">
              <BarChart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="pie" className="px-3">
              <PieChart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="line" className="px-3">
              <LineChart className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {Math.round(overallStats.averageImplementation)}%
          <span className="text-sm ml-2 font-normal text-gray-500">implemented</span>
        </div>
        <div className="text-sm text-gray-500 mb-6">
          {implementedFeatures} of {totalFeatures} features completed
          {partialFeatures > 0 && `, ${partialFeatures} partial`}
          {inProgressFeatures > 0 && `, ${inProgressFeatures} in progress`}
        </div>
        
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && (
          <div className="flex justify-center items-center h-48 text-gray-400">
            Pie chart visualization (upgrade to Pro)
          </div>
        )}
        {chartType === 'line' && (
          <div className="flex justify-center items-center h-48 text-gray-400">
            Line chart visualization (upgrade to Pro)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImplementationOverview;
