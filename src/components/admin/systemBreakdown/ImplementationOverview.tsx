
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart } from 'lucide-react';
import { FeatureItem } from './types';
import SystemHealthCheck from './components/SystemHealthCheck';
import { calculateFeatureStatistics } from './utils';
import StatusPieChart from './components/charts/StatusPieChart';
import ProgressLineChart from './components/charts/ProgressLineChart';
import { MonthlyProgressData } from './types';

interface ImplementationOverviewProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  monthlyProgressData?: MonthlyProgressData[];
}

const ImplementationOverview: React.FC<ImplementationOverviewProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  monthlyProgressData = []
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  
  // Calculate feature statistics
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures];
  const overallStats = calculateFeatureStatistics(allFeatures);
  
  // Calculate statistics for each user type separately
  const adminStats = calculateFeatureStatistics(adminFeatures);
  const establishmentStats = calculateFeatureStatistics(establishmentFeatures);
  const individualStats = calculateFeatureStatistics(individualFeatures);
  const promoterStats = calculateFeatureStatistics(promoterFeatures);
  
  // Prepare data for pie chart
  const pieChartData = useMemo(() => [
    { name: 'Implemented', value: overallStats.implementedFeatures, color: '#22c55e' },
    { name: 'In Progress', value: overallStats.inProgressFeatures, color: '#eab308' },
    { name: 'Planned', value: overallStats.plannedFeatures, color: '#94a3b8' },
    { name: 'Blocked', value: overallStats.blockedFeatures, color: '#ef4444' },
  ], [overallStats]);

  // Render bar chart with basic CSS
  const renderBarChart = () => (
    <div className="mt-6">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Implemented ({overallStats.implementedFeatures})</span>
            <span>{Math.round((overallStats.implementedFeatures / allFeatures.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${Math.round((overallStats.implementedFeatures / allFeatures.length) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>In Progress ({overallStats.inProgressFeatures})</span>
            <span>{Math.round((overallStats.inProgressFeatures / allFeatures.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${Math.round((overallStats.inProgressFeatures / allFeatures.length) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Planned ({overallStats.plannedFeatures})</span>
            <span>{Math.round((overallStats.plannedFeatures / allFeatures.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${Math.round((overallStats.plannedFeatures / allFeatures.length) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        {overallStats.blockedFeatures > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Blocked ({overallStats.blockedFeatures})</span>
              <span>{Math.round((overallStats.blockedFeatures / allFeatures.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${Math.round((overallStats.blockedFeatures / allFeatures.length) * 100)}%` }}
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
          {overallStats.implementedFeatures} of {allFeatures.length} features completed
          {overallStats.partialFeatures > 0 && `, ${overallStats.partialFeatures} partial`}
          {overallStats.inProgressFeatures > 0 && `, ${overallStats.inProgressFeatures} in progress`}
        </div>
        
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && <StatusPieChart data={pieChartData} title="Feature Status Distribution" />}
        {chartType === 'line' && monthlyProgressData && (
          <ProgressLineChart 
            data={monthlyProgressData} 
            title="Implementation Progress Over Time" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ImplementationOverview;
