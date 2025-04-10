import React from 'react';
import CategoryCard from '../components/CategoryCard';
import RecentFeaturesList from '../components/RecentFeaturesList';
import { FeatureItem } from '../types';
interface CategoriesTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  promoterFeatures?: FeatureItem[];
  adminProgress: {
    frontend: number;
    backend: number;
    overall: number;
  };
  establishmentProgress: {
    frontend: number;
    backend: number;
    overall: number;
  };
  individualProgress: {
    frontend: number;
    backend: number;
    overall: number;
  };
  promoterProgress?: {
    frontend: number;
    backend: number;
    overall: number;
  };
}
const CategoriesTab: React.FC<CategoriesTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures = [],
  adminProgress,
  establishmentProgress,
  individualProgress,
  promoterProgress = {
    frontend: 0,
    backend: 0,
    overall: 0
  }
}) => {
  return <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        {/* Create CategoryCard components with the correct prop structure */}
        <CategoryCard category={{
        name: "Admin Features",
        description: "Features for system administrators",
        featureCount: adminFeatures.length,
        implementationRate: adminProgress.overall,
        features: adminFeatures
      }} />
        <CategoryCard category={{
        name: "Establishment Features",
        description: "Features for establishment owners",
        featureCount: establishmentFeatures.length,
        implementationRate: establishmentProgress.overall,
        features: establishmentFeatures
      }} />
        <CategoryCard category={{
        name: "Individual Features",
        description: "Features for regular users",
        featureCount: individualFeatures.length,
        implementationRate: individualProgress.overall,
        features: individualFeatures
      }} />
        <CategoryCard category={{
        name: "Promoter Features",
        description: "Features for event promoters",
        featureCount: promoterFeatures.length,
        implementationRate: promoterProgress.overall,
        features: promoterFeatures
      }} />
      </div>
      
      {/* Top Features in Each Category */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Recently Updated Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RecentFeaturesList title="Admin" features={adminFeatures.filter(f => f.statusUpdated).slice(0, 3)} />
          <RecentFeaturesList title="Establishment" features={establishmentFeatures.filter(f => f.statusUpdated).slice(0, 3)} />
          <RecentFeaturesList title="Individual" features={individualFeatures.filter(f => f.statusUpdated).slice(0, 3)} />
          <RecentFeaturesList title="Promoter" features={promoterFeatures.filter(f => f.statusUpdated).slice(0, 3)} />
        </div>
      </div>
    </div>;
};
export default CategoriesTab;