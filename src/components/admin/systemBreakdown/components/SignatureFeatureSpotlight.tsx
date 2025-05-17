
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { FeatureShowcaseData, FeatureItem, FeatureBusinessValueType } from '../types';
import * as Icons from 'lucide-react';

interface SignatureFeatureSpotlightProps {
  feature?: FeatureItem;
  features?: FeatureShowcaseData[];
  businessValue?: FeatureBusinessValueType;
}

const SignatureFeatureSpotlight: React.FC<SignatureFeatureSpotlightProps> = (props) => {
  // Check which type of props we received and prepare data accordingly
  let features: FeatureShowcaseData[] = [];
  
  if (props.features) {
    // If we got a list of showcase features directly
    features = props.features;
  } else if (props.feature) {
    // If we got a single feature item, map it to showcase data
    features = [mapFeatureItemToShowcaseData(props.feature, props.businessValue)];
  }
  
  // If we have no signature features, show a message
  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No signature features to display</h3>
        <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
      </div>
    );
  }

  // Create a dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const LucideIcon = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Star;
    return <LucideIcon className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          // Determine the color scheme based on business value
          let colorClass = 'border-blue-200 bg-blue-50';
          let badgeClass = 'bg-blue-100 text-blue-800';
          
          if (feature.businessValue === 'high') {
            colorClass = 'border-purple-200 bg-purple-50';
            badgeClass = 'bg-purple-100 text-purple-800';
          } else if (feature.businessValue === 'medium') {
            colorClass = 'border-green-200 bg-green-50';
            badgeClass = 'bg-green-100 text-green-800';
          }
          
          return (
            <Card key={feature.id} className={`${colorClass} border-2 overflow-hidden`}>
              <CardHeader className="pb-2 relative">
                <div className="absolute top-3 right-3">
                  <Badge className={badgeClass}>
                    {feature.businessValue} value
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`${colorClass} p-2 rounded-lg`}>
                    <DynamicIcon iconName={feature.iconName || 'star'} />
                  </div>
                  <CardTitle>{feature.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
                
                {feature.marketingPoints && feature.marketingPoints.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Key Benefits:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {feature.marketingPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 text-sm text-gray-500">
                <div>
                  {feature.implementationPercentage ?? 0}% Complete
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" /> 
                  {feature.userType}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to map a FeatureItem to FeatureShowcaseData
function mapFeatureItemToShowcaseData(feature: FeatureItem, overrideBusinessValue?: FeatureBusinessValueType): FeatureShowcaseData {
  // Use the provided business value or default to the feature's userImpact
  const businessValue = overrideBusinessValue || (feature.userImpact as FeatureBusinessValueType) || 'medium';
  
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    businessValue,
    complexityLevel: feature.complexity || 'medium',
    implementationStatus: feature.status,
    showcaseCategory: feature.category || 'Management Tools', // Default category
    isSignature: feature.tags?.includes('signature') || false,
    iconName: 'Star',
    userType: determineUserType(feature),
    marketingPoints: feature.description ? [feature.description.split('.')[0]] : [],
    implementationPercentage: feature.implementationProgress
  };
}

// Helper function to determine the user type from a feature
function determineUserType(feature: FeatureItem): 'admin' | 'establishment' | 'individual' | 'promoter' {
  if (feature.adminAccess === 'full') return 'admin';
  if (feature.establishmentAccess === 'full') return 'establishment';
  if (feature.promoterAccess === 'full') return 'promoter';
  return 'individual';
}

export default SignatureFeatureSpotlight;
