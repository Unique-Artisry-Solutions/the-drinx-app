
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FeatureItem, FeatureBusinessValueObject, FeatureShowcaseData } from './types';
import { prepareFeatureShowcaseData } from './utils';
import CategoryCard from './components/CategoryCard';
import BusinessValueSection from './components/BusinessValueSection';
import SignatureFeatureSpotlight from './components/SignatureFeatureSpotlight';
import { AlertTriangle } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

interface FeatureShowcaseTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
}

const FeatureShowcaseTab: React.FC<FeatureShowcaseTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures
}) => {
  const [activeTab, setActiveTab] = useState('categories');
  
  const showcaseData = useMemo(() => {
    try {
      const allFeatures = [
        ...adminFeatures,
        ...establishmentFeatures,
        ...individualFeatures,
        ...promoterFeatures
      ];
      
      return prepareFeatureShowcaseData(allFeatures);
    } catch (error) {
      console.error('Error preparing showcase data:', error);
      return [];
    }
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  const signatureFeatures = useMemo(() => {
    return showcaseData.filter(feature => feature.isSignature);
  }, [showcaseData]);
  
  // Group features by business value for the business value section
  const businessValueGroups = useMemo(() => {
    if (!showcaseData.length) return [];
    
    const valueMap: Record<string, FeatureBusinessValueObject> = {};
    
    showcaseData.forEach(feature => {
      const value = feature.businessValue;
      
      if (!valueMap[value]) {
        valueMap[value] = {
          value: value,
          label: `${value.charAt(0).toUpperCase() + value.slice(1)} Value`,
          name: `${value.charAt(0).toUpperCase() + value.slice(1)} Value Features`,
          description: `Features that provide ${value} business value`,
          color: value === 'high' ? 'purple' : value === 'medium' ? 'blue' : 'gray',
          features: [],
          implementationRate: 0,
          featureCount: 0
        };
      }
      
      // Add the original feature item
      const originalFeature = [...adminFeatures, ...establishmentFeatures, ...individualFeatures, ...promoterFeatures]
        .find(f => f.id === feature.id);
      
      if (originalFeature) {
        valueMap[value].features.push(originalFeature);
      }
    });
    
    // Calculate implementation rates
    Object.values(valueMap).forEach(group => {
      group.featureCount = group.features.length;
      group.implementationRate = Math.round(
        (group.features.filter(f => f.status === 'implemented').length / group.features.length) * 100
      );
    });
    
    return Object.values(valueMap);
  }, [showcaseData, adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  if (!showcaseData.length) {
    return (
      <Card className="p-6">
        <CardContent className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="text-lg font-medium">No Feature Data Available</h3>
          <p className="text-gray-500">There was an error loading the feature showcase data.</p>
        </CardContent>
      </Card>
    );
  }

  const categories = Array.from(new Set(showcaseData.map(f => f.showcaseCategory)));
  const categoryData = categories.map(cat => ({
    name: cat,
    features: showcaseData.filter(f => f.showcaseCategory === cat),
    description: `${cat} related features and capabilities`,
    implementationRate: Math.round(
      (showcaseData.filter(f => f.showcaseCategory === cat && f.implementationStatus === 'implemented').length /
        showcaseData.filter(f => f.showcaseCategory === cat).length) * 100
    ),
    featureCount: showcaseData.filter(f => f.showcaseCategory === cat).length
  }));

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="business">Business Value</TabsTrigger>
            <TabsTrigger value="signature">Signature Features</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.map((category) => (
                <CategoryCard 
                  key={category.name}
                  category={category}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="business">
            <BusinessValueSection values={businessValueGroups} />
          </TabsContent>

          <TabsContent value="signature">
            <SignatureFeatureSpotlight features={signatureFeatures} />
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
};

export default FeatureShowcaseTab;
