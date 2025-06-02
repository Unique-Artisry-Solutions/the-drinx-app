
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureShowcaseData, FeatureShowcaseCategoryType } from '../types';
import * as Icons from 'lucide-react';

interface FeatureCategoriesDashboardProps {
  features: FeatureShowcaseData[];
}

// Define category icons and colors
const categoryConfig: Record<string, { icon: string; color: string }> = {
  'AI & Recommendations': { icon: 'Brain', color: 'text-purple-500' },
  'Social Experience': { icon: 'Users', color: 'text-blue-500' },
  'Business Analytics': { icon: 'BarChart', color: 'text-emerald-500' },
  'User Engagement': { icon: 'Heart', color: 'text-pink-500' },
  'Management Tools': { icon: 'Settings', color: 'text-gray-500' },
  'Customization': { icon: 'Paintbrush', color: 'text-amber-500' },
  'Loyalty & Rewards': { icon: 'Award', color: 'text-red-500' }
};

const FeatureCategoriesDashboard: React.FC<FeatureCategoriesDashboardProps> = ({ features }) => {
  // Group features by category
  const categorizedFeatures: Record<string, FeatureShowcaseData[]> = {};
  
  features.forEach(feature => {
    if (!categorizedFeatures[feature.showcaseCategory]) {
      categorizedFeatures[feature.showcaseCategory] = [];
    }
    categorizedFeatures[feature.showcaseCategory].push(feature);
  });
  
  // If we have no features to display
  if (Object.keys(categorizedFeatures).length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.Layers className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No features to display</h3>
        <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
      </div>
    );
  }

  // Create a dynamic icon component
  const CategoryIcon = ({ category }: { category: string }) => {
    const config = categoryConfig[category] || { icon: 'Star', color: 'text-blue-500' };
    const IconComponent = (Icons as any)[config.icon] || Icons.Star;
    return <IconComponent className={`h-6 w-6 ${config.color}`} />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(categorizedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <CategoryIcon category={category} />
              </div>
              <div>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {categoryFeatures.length} {categoryFeatures.length === 1 ? 'feature' : 'features'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {categoryFeatures.map(feature => {
                const statusColor = feature.implementationStatus === 'implemented' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800';
                
                return (
                  <div key={feature.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feature.isSignature && (
                        <Icons.Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <Badge className={statusColor}>
                      {feature.implementationStatus}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCategoriesDashboard;
