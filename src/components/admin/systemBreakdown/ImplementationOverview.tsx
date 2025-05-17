
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, LabelList, Cell } from 'recharts';
import { FeatureItem, MonthlyProgressData } from './types';

interface ImplementationOverviewProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
  monthlyProgressData: MonthlyProgressData[];
}

type ProgressData = {
  month: string;
  totalImplemented: number;
  adminImplemented: number;
  establishmentImplemented: number;
  individualImplemented: number;
  promoterImplemented: number;
  frontend: number;
  backend: number;
};

const ImplementationOverview: React.FC<ImplementationOverviewProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  monthlyProgressData,
}) => {
  // Calculate implementation progress
  const totalFeatures = adminFeatures.length + establishmentFeatures.length + individualFeatures.length + promoterFeatures.length;
  
  const implementedFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures,
  ].filter((feature) => feature.status === 'implemented').length;
  
  const implementationPercentage = Math.round((implementedFeatures / totalFeatures) * 100);
  
  // Calculate implementation by user type
  const adminImplemented = adminFeatures.filter((f) => f.status === 'implemented').length;
  const establishmentImplemented = establishmentFeatures.filter((f) => f.status === 'implemented').length;
  const individualImplemented = individualFeatures.filter((f) => f.status === 'implemented').length;
  const promoterImplemented = promoterFeatures.filter((f) => f.status === 'implemented').length;
  
  const adminPercentage = Math.round((adminImplemented / adminFeatures.length) * 100);
  const establishmentPercentage = Math.round((establishmentImplemented / establishmentFeatures.length) * 100);
  const individualPercentage = Math.round((individualImplemented / individualFeatures.length) * 100);
  const promoterPercentage = Math.round((promoterImplemented / promoterFeatures.length) * 100);
  
  const implementationByUserType = [
    { name: 'Admin', value: adminPercentage, color: '#8b5cf6' },
    { name: 'Establishment', value: establishmentPercentage, color: '#ec4899' },
    { name: 'Individual', value: individualPercentage, color: '#06b6d4' },
    { name: 'Promoter', value: promoterPercentage, color: '#f59e0b' },
  ];
  
  // Calculate implementation by priority
  const highPriorityFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures,
  ].filter((f) => f.userImpact === 'high');
  
  const mediumPriorityFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures,
  ].filter((f) => f.userImpact === 'medium');
  
  const lowPriorityFeatures = [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures,
  ].filter((f) => f.userImpact === 'low');
  
  const highPriorityImplemented = highPriorityFeatures.filter((f) => f.status === 'implemented').length;
  const mediumPriorityImplemented = mediumPriorityFeatures.filter((f) => f.status === 'implemented').length;
  const lowPriorityImplemented = lowPriorityFeatures.filter((f) => f.status === 'implemented').length;
  
  const highPriorityPercentage = Math.round((highPriorityImplemented / (highPriorityFeatures.length || 1)) * 100);
  const mediumPriorityPercentage = Math.round((mediumPriorityImplemented / (mediumPriorityFeatures.length || 1)) * 100);
  const lowPriorityPercentage = Math.round((lowPriorityImplemented / (lowPriorityFeatures.length || 1)) * 100);
  
  const implementationByPriority = [
    { name: 'High', value: highPriorityPercentage, color: '#ef4444' },
    { name: 'Medium', value: mediumPriorityPercentage, color: '#f59e0b' },
    { name: 'Low', value: lowPriorityPercentage, color: '#3b82f6' },
  ];
  
  // Enhancement: Calculate implementation by status
  const featuresByStatus = [
    { name: 'Implemented', value: implementedFeatures, color: '#10b981' },
    { name: 'In Progress', value: [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures,
    ].filter((f) => f.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Planned', value: [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures,
    ].filter((f) => f.status === 'planned').length, color: '#f59e0b' },
    { name: 'Blocked', value: [
      ...adminFeatures,
      ...establishmentFeatures,
      ...individualFeatures,
      ...promoterFeatures,
    ].filter((f) => f.status === 'blocked').length, color: '#ef4444' },
  ];

  // Convert MonthlyProgressData to ProgressData for the chart
  const progressDataForChart: ProgressData[] = monthlyProgressData.map(item => ({
    ...item,
    frontend: 0, // Add default values for frontend and backend
    backend: 0
  }));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Implementation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{implementationPercentage}%</span>
            </div>
            <Progress value={implementationPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {implementedFeatures} of {totalFeatures} features implemented
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Implementation by User Type</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={implementationByUserType}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Implemented']} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {implementationByUserType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="right" formatter={(value: number) => `${value}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Implementation by Priority</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={implementationByPriority}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Implemented']} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {implementationByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="right" formatter={(value: number) => `${value}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Progress Over Time</h3>
            <Tabs defaultValue="overall">
              <TabsList className="mb-2">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                <TabsTrigger value="byUserType">By User Type</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={progressDataForChart}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="totalImplemented" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="byUserType">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={progressDataForChart}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="adminImplemented" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Admin" />
                      <Area type="monotone" dataKey="establishmentImplemented" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} name="Establishment" />
                      <Area type="monotone" dataKey="individualImplemented" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Individual" />
                      <Area type="monotone" dataKey="promoterImplemented" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Promoter" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationOverview;
