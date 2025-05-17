
import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  ChartContainer, 
  ChartBars 
} from "@tremor/react";

import { FeatureItem } from './types';
import { calculateFeatureStatistics } from './utils';
import { renderStatusBadge } from './utils/statusRenderers';

interface PromoterRequirementsProps {
  features: FeatureItem[];
}

const PromoterRequirementsTab: React.FC<PromoterRequirementsProps> = ({ 
  features 
}) => {
  // Group features by category for better organization
  const featuresByCategory = useMemo(() => {
    const categories: Record<string, FeatureItem[]> = {};
    
    features.forEach(feature => {
      if (feature.tags && feature.tags.length > 0) {
        // Find categories in tags (excluding "promoter" which is too general)
        const categoryTags = feature.tags.filter(tag => tag !== 'promoter');
        
        if (categoryTags.length > 0) {
          const category = categoryTags[0]; // Use first category tag
          if (!categories[category]) categories[category] = [];
          categories[category].push(feature);
        } else {
          if (!categories['general']) categories['general'] = [];
          categories['general'].push(feature);
        }
      } else {
        if (!categories['uncategorized']) categories['uncategorized'] = [];
        categories['uncategorized'].push(feature);
      }
    });
    
    return categories;
  }, [features]);
  
  // Statistics for chart visualization
  const categoryStats = useMemo(() => {
    return Object.entries(featuresByCategory).map(([category, items]) => {
      const stats = calculateFeatureStatistics(items);
      return {
        category: formatCategoryName(category),
        count: items.length,
        implemented: stats.implementedFeatures,
        inProgress: stats.inProgressFeatures,
        planned: stats.plannedFeatures,
        blocked: stats.blockedFeatures || 0,
        implementationRate: stats.implementationRate,
      };
    }).sort((a, b) => b.count - a.count);
  }, [featuresByCategory]);
  
  // Format category names for better display
  function formatCategoryName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Calculate statistics for summary view
  const stats = calculateFeatureStatistics(features);
  const totalFeatures = features.length;
  
  // Data for the implementation chart
  const chartData = [
    { name: 'Implemented', value: stats.implementedFeatures },
    { name: 'In Progress', value: stats.inProgressFeatures },
    { name: 'Planned', value: stats.plannedFeatures },
    { name: 'Blocked', value: stats.blockedFeatures || 0 },
  ];

  // Data for the database implementation chart
  const dbStats = useMemo(() => {
    const completed = features.filter(f => f.databaseStatus === 'completed' || f.databaseStatus === 'implemented').length;
    const inProgress = features.filter(f => f.databaseStatus === 'in_progress').length;
    const partial = features.filter(f => f.databaseStatus === 'partial').length;
    const notStarted = features.filter(f => !f.databaseStatus || f.databaseStatus === 'not_started').length;
    
    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Partial', value: partial },
      { name: 'Not Started', value: notStarted },
    ];
  }, [features]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round(stats.implementationRate)}%
              <span className="text-sm ml-2 font-normal text-gray-500">implemented</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {stats.implementedFeatures} of {totalFeatures} promoter features
            </div>
            <div className="h-64">
              <BarChart 
                data={chartData}
                index="name"
                categories={["value"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} features`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round((stats.dbComplete || 0) / totalFeatures * 100)}%
              <span className="text-sm ml-2 font-normal text-gray-500">completed</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {stats.dbComplete} of {totalFeatures} database schemas
            </div>
            <div className="h-64">
              <BarChart 
                data={dbStats}
                index="name"
                categories={["value"]}
                colors={["green"]}
                valueFormatter={(value) => `${value} features`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Object.keys(featuresByCategory).length}
              <span className="text-sm ml-2 font-normal text-gray-500">categories</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {categoryStats.slice(0, 3).map(cat => cat.category).join(', ')} and more
            </div>
            <div className="h-64">
              <BarChart 
                data={categoryStats.slice(0, 7)} // Show top 7 categories
                index="category"
                categories={["count"]}
                colors={["purple"]}
                valueFormatter={(value) => `${value} features`}
                yAxisWidth={30}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Features</TabsTrigger>
          {categoryStats.slice(0, 5).map(cat => (
            <TabsTrigger key={cat.category} value={cat.category.toLowerCase()}>
              {cat.category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(feature => (
              <Card key={feature.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">{feature.name}</CardTitle>
                    {renderStatusBadge(feature.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{feature.description}</p>
                  <div className="flex mt-2 text-xs space-x-2">
                    {feature.tags && feature.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {categoryStats.slice(0, 5).map(cat => (
          <TabsContent key={cat.category} value={cat.category.toLowerCase()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(featuresByCategory)
                .find(([category]) => formatCategoryName(category).toLowerCase() === cat.category.toLowerCase())?.[1]
                .map(feature => (
                  <Card key={feature.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium">{feature.name}</CardTitle>
                        {renderStatusBadge(feature.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{feature.description}</p>
                      <div className="flex mt-2 text-xs space-x-2">
                        {feature.tags && feature.tags.map((tag, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PromoterRequirementsTab;
