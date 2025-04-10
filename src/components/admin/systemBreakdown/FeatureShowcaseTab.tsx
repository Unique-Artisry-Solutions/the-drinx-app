
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
import { FeatureItem } from './types';
import { isSignatureFeature, prepareFeatureShowcaseData } from './utils';
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
  const showcaseData = useMemo(() => 
    prepareFeatureShowcaseData([
      ...adminFeatures,
      ...establishmentFeatures, 
      ...individualFeatures,
      ...promoterFeatures
    ]),
  [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);
  
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
            {showcaseData.categories.map(category => (
              <CategoryCard 
                key={category.name}
                category={category}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="business">
          <BusinessValueSection businessValues={showcaseData.businessValues} />
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
                {signatureFeatures.map(feature => (
                  <SignatureFeatureSpotlight key={feature.id} feature={feature} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureShowcaseTab;
