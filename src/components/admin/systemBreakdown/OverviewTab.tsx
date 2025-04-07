
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { FeatureItem } from './types';

interface OverviewTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Overview</CardTitle>
        <CardDescription>Key features by user type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-spiritless-pink">Admin Users</h3>
            <ul className="space-y-2">
              {adminFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-spiritless-green">Establishments</h3>
            <ul className="space-y-2">
              {establishmentFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-3 text-spiritless-blue">Individual Users</h3>
            <ul className="space-y-2">
              {individualFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Key Platform Differentiators</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">Swig Circuits (Bar Crawls)</h4>
              <p className="text-sm text-gray-600">
                Our unique bar crawl feature allows users to create personalized non-alcoholic drink tours
                across multiple establishments. Establishments can opt-in to be featured, creating a
                win-win ecosystem for discovery and promotion.
              </p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">Comprehensive Analytics</h4>
              <p className="text-sm text-gray-600">
                Both establishments and the platform benefit from detailed analytics on visitor behavior,
                popular drinks, and customer preferences - enabling data-driven decisions for menu optimization
                and targeted promotions.
              </p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">Mocktail Community</h4>
              <p className="text-sm text-gray-600">
                Beyond just finding establishments, Spiritless builds a community around alcohol-free drinking
                culture with user recipes, ratings, reviews, and social sharing capabilities.
              </p>
            </div>
            <div className="border p-4 rounded-md">
              <h4 className="font-medium mb-2">Dual-sided Marketplace</h4>
              <p className="text-sm text-gray-600">
                By serving both establishments and individual users with targeted features, Spiritless
                creates network effects that increase platform value for all participants.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
