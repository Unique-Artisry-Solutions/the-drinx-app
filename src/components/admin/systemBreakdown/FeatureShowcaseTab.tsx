
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FeatureItem, FeatureShowcaseData } from './types';
import { isSignatureFeature } from './utils';
import SignatureFeatureSpotlight from './components/SignatureFeatureSpotlight';
import CategoryCard from './components/CategoryCard';
import BusinessValueSection from './components/BusinessValueSection';

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
  
  // Get all signature features across all user types
  const signatureFeatures = useMemo(() => [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ].filter(isSignatureFeature), [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  // Organize features by category and business value
  const showcaseData = useMemo(() => {
    // Mock implementation to avoid errors until real implementation is fixed
    const allFeatures = [
      ...adminFeatures,
      ...establishmentFeatures, 
      ...individualFeatures,
      ...promoterFeatures
    ];
    
    // Simple mapping for showcase data
    const featureShowcaseData: FeatureShowcaseData[] = allFeatures.map(feature => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      businessValue: (feature.userImpact as any) || 'medium',
      complexity: feature.complexity || 'medium',
      implementationStatus: feature.status,
      showcaseCategory: 'Management Tools', // Default
      isSignature: isSignatureFeature(feature),
      icon: 'Star',
      marketingPoints: [],
      implementations: 0,
      avgRating: 0,
    }));
    
    // Create mock category data
    const categoryData = [
      {
        name: 'User Experience',
        description: 'Features that enhance the user experience',
        featureCount: Math.floor(allFeatures.length / 3),
        implementationRate: 75,
        icon: { name: 'User' },
        features: allFeatures.slice(0, Math.floor(allFeatures.length / 3))
      },
      {
        name: 'Management Tools',
        description: 'Features for administration and management',
        featureCount: Math.floor(allFeatures.length / 3),
        implementationRate: 85,
        icon: { name: 'Settings' },
        features: allFeatures.slice(Math.floor(allFeatures.length / 3), Math.floor(allFeatures.length * 2/3))
      },
      {
        name: 'Analytics',
        description: 'Data analysis and reporting features',
        featureCount: allFeatures.length - Math.floor(allFeatures.length * 2/3),
        implementationRate: 65,
        icon: { name: 'BarChart' },
        features: allFeatures.slice(Math.floor(allFeatures.length * 2/3))
      }
    ];
    
    // Create mock business value data
    const businessValueData = [
      {
        name: 'High Value',
        description: 'Critical business features',
        featureCount: allFeatures.filter(f => f.userImpact === 'high').length,
        implementationRate: 80,
        features: allFeatures.filter(f => f.userImpact === 'high')
      },
      {
        name: 'Medium Value',
        description: 'Important features',
        featureCount: allFeatures.filter(f => f.userImpact === 'medium').length,
        implementationRate: 70,
        features: allFeatures.filter(f => f.userImpact === 'medium')
      },
      {
        name: 'Low Value',
        description: 'Nice-to-have features',
        featureCount: allFeatures.filter(f => f.userImpact === 'low').length,
        implementationRate: 60,
        features: allFeatures.filter(f => f.userImpact === 'low')
      }
    ];
    
    // Attach the categories and business values as properties of the array
    const result = featureShowcaseData as any;
    result.categories = categoryData;
    result.businessValues = businessValueData;
    
    return result;
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
  // Calculate implementation percentage for signature features
  const signatureImplementationRate = useMemo(() => {
    if (signatureFeatures.length === 0) return 0;
    const sum = signatureFeatures.reduce((acc, feature) => acc + (feature.implementationProgress || 0), 0);
    return Math.round(sum / signatureFeatures.length);
  }, [signatureFeatures]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Feature Showcase</h2>
          <p className="text-muted-foreground">
            Highlighting the platform's key capabilities and implementation status
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <span className="mr-1">Signature Features:</span>
            <span className="font-semibold">{signatureFeatures.length}</span>
          </Badge>
          
          <Badge className={`px-3 py-1 ${
            signatureImplementationRate >= 75 ? 'bg-green-500' : 
            signatureImplementationRate >= 50 ? 'bg-yellow-500' : 
            'bg-orange-500'
          }`}>
            {signatureImplementationRate}% Implemented
          </Badge>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="business">Business Value</TabsTrigger>
          <TabsTrigger value="signature">Signature Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseData.categories.map((category) => (
              <CategoryCard 
                key={category.name}
                category={category}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="business">
          <BusinessValueSection values={showcaseData.businessValues} />
        </TabsContent>
        
        <TabsContent value="signature" className="space-y-6">
          {signatureFeatures.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent>
                <p className="text-lg text-muted-foreground pt-6">
                  No signature features have been defined yet.
                </p>
                <Button className="mt-4">Define Signature Features</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Signature Features</CardTitle>
                  <CardDescription>
                    These features represent the core value proposition of the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Signature features are the differentiating capabilities that set our platform apart
                    from competitors and deliver exceptional value to users.
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SignatureFeatureSpotlight features={signatureFeatures.map(feature => ({
                  id: feature.id,
                  name: feature.name,
                  description: feature.description,
                  businessValue: (feature.userImpact as any),
                  complexity: feature.complexity,
                  implementationStatus: feature.status,
                  showcaseCategory: 'Management Tools',
                  isSignature: true,
                  icon: 'Star',
                  marketingPoints: [],
                  implementations: 0,
                  avgRating: 0
                }))} />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureShowcaseTab;
