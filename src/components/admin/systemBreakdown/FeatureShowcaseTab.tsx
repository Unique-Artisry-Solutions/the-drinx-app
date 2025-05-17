
import React, { useMemo } from 'react';
import { prepareFeatureShowcaseData } from './utils';
import { FeatureShowcaseCategoryType, FeatureItem } from './types';
import FeatureShowcaseFilter from './components/showcase/FeatureShowcaseFilter';
import SignatureFeatureSpotlight from './components/SignatureFeatureSpotlight';
import CategoryShowcase from './components/showcase/CategoryShowcase';
import { determineBusinessValue, determineComplexity } from './utils/featureShowcase/featureTransformation';

interface FeatureShowcaseTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures: FeatureItem[];
}

/**
 * Component for displaying features in an attractive showcase format
 */
const FeatureShowcaseTab: React.FC<FeatureShowcaseTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures
}) => {
  // Prepare the feature showcase data
  const showcaseData = useMemo(() => {
    return prepareFeatureShowcaseData(
      adminFeatures,
      establishmentFeatures,
      individualFeatures,
      promoterFeatures
    );
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  // Find signature features
  const signatureFeatures = useMemo(() => {
    return showcaseData.filter(feature => feature.isSignature);
  }, [showcaseData]);

  // Group features by category
  const categories = useMemo(() => {
    const categoryMap = new Map<string, FeatureShowcaseCategoryType>();

    showcaseData.forEach(feature => {
      const category = feature.showcaseCategory;
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          description: `Features related to ${category.toLowerCase()}`,
          features: [],
          implementationRate: 0,
          featureCount: 0
        });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.features.push(feature);
      categoryData.featureCount = categoryData.features.length;
      
      // Update implementation rate
      const implementedCount = categoryData.features.filter(f => 
        f.implementationStatus === 'implemented'
      ).length;
      
      categoryData.implementationRate = Math.round(
        (implementedCount / categoryData.featureCount) * 100
      );
    });

    return Array.from(categoryMap.values());
  }, [showcaseData]);

  // Sort categories by implementation rate
  const sortedCategories = [...categories].sort((a, b) => 
    b.implementationRate - a.implementationRate
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Feature Showcase</h2>
      <p className="text-gray-500">
        Explore the features of the Swig platform organized by category.
      </p>
      
      {signatureFeatures.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Signature Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureFeatures.slice(0, 3).map(feature => (
              <SignatureFeatureSpotlight 
                key={feature.id} 
                feature={feature} 
                businessValue={feature.businessValue} 
              />
            ))}
          </div>
        </div>
      )}
      
      <FeatureShowcaseFilter categories={categories} />
      
      {sortedCategories.map(category => (
        <CategoryShowcase key={category.name} category={category} />
      ))}
    </div>
  );
};

export default FeatureShowcaseTab;
