
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureShowcaseData } from '../types';
import * as Icons from 'lucide-react';

interface BusinessValueSectionProps {
  features: FeatureShowcaseData[];
}

interface BusinessValueConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const BusinessValueSection: React.FC<BusinessValueSectionProps> = ({ features }) => {
  // Group features by business value
  const highValueFeatures = features.filter(f => f.businessValue === 'high');
  const mediumValueFeatures = features.filter(f => f.businessValue === 'medium');
  const lowValueFeatures = features.filter(f => f.businessValue === 'low');
  
  // Configuration for each business value level
  const valueConfigs: Record<string, BusinessValueConfig> = {
    high: {
      icon: <Icons.TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "High Business Value",
      description: "Features with significant impact on revenue, user engagement, and competitive advantage",
      color: "border-purple-200 bg-purple-50"
    },
    medium: {
      icon: <Icons.BarChart2 className="h-6 w-6 text-blue-600" />,
      title: "Medium Business Value",
      description: "Features that provide moderate benefits to user experience and business operations",
      color: "border-blue-200 bg-blue-50"
    },
    low: {
      icon: <Icons.CircleDot className="h-6 w-6 text-green-600" />,
      title: "Supporting Features",
      description: "Features that round out the platform and provide incremental improvements",
      color: "border-green-200 bg-green-50"
    }
  };
  
  // If we have no features to display
  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.BarChart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No features to display</h3>
        <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
      </div>
    );
  }

  // Helper to render the features for a specific value level
  const renderFeatureList = (valueFeatures: FeatureShowcaseData[]) => {
    if (valueFeatures.length === 0) {
      return <p className="text-gray-500 italic">No features in this category</p>;
    }
    
    return (
      <div className="space-y-3 mt-4">
        {valueFeatures.map(feature => (
          <div key={feature.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feature.isSignature && (
                <Icons.Star className="h-4 w-4 text-yellow-500" />
              )}
              <span className="font-medium">{feature.name}</span>
              <span className="text-sm text-gray-500 hidden md:inline">— {feature.description.slice(0, 60)}{feature.description.length > 60 ? '...' : ''}</span>
            </div>
            <Badge className={feature.implementationStatus === 'implemented' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
              {feature.implementationStatus}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* High Value Features */}
      <Card className={`${valueConfigs.high.color} border-2`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-50 p-2 rounded-lg">
              {valueConfigs.high.icon}
            </div>
            <div>
              <CardTitle>{valueConfigs.high.title}</CardTitle>
              <p className="text-sm text-gray-600">{valueConfigs.high.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderFeatureList(highValueFeatures)}
        </CardContent>
      </Card>
      
      {/* Medium Value Features */}
      <Card className={`${valueConfigs.medium.color} border-2`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-50 p-2 rounded-lg">
              {valueConfigs.medium.icon}
            </div>
            <div>
              <CardTitle>{valueConfigs.medium.title}</CardTitle>
              <p className="text-sm text-gray-600">{valueConfigs.medium.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderFeatureList(mediumValueFeatures)}
        </CardContent>
      </Card>
      
      {/* Low Value Features */}
      <Card className={`${valueConfigs.low.color} border-2`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-50 p-2 rounded-lg">
              {valueConfigs.low.icon}
            </div>
            <div>
              <CardTitle>{valueConfigs.low.title}</CardTitle>
              <p className="text-sm text-gray-600">{valueConfigs.low.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderFeatureList(lowValueFeatures)}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessValueSection;
