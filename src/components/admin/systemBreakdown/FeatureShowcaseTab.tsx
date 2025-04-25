
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FeatureItem } from './types';
import { prepareFeatureShowcaseData } from './utils/featureShowcaseUtils';
import { isSignatureFeature } from './utils/featureDetection';
import CategoryCard from './components/CategoryCard';
import BusinessValueSection from './components/BusinessValueSection';
import SignatureFeatureSpotlight from './components/SignatureFeatureSpotlight';
import { AlertTriangle } from 'lucide-react';

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
    )
  }));

  return (
    <div className="space-y-6">
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
          <BusinessValueSection values={showcaseData} />
        </TabsContent>

        <TabsContent value="signature">
          <SignatureFeatureSpotlight features={signatureFeatures} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureShowcaseTab;
