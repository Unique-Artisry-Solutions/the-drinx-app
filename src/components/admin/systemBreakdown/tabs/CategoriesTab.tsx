
import React from 'react';
import CategoryCard from '../components/CategoryCard';
import RecentFeaturesList from '../components/RecentFeaturesList';
import { FeatureItem } from '../types';

interface CategoriesTabProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  adminProgress: { frontend: number; backend: number; overall: number };
  establishmentProgress: { frontend: number; backend: number; overall: number };
  individualProgress: { frontend: number; backend: number; overall: number };
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  adminProgress,
  establishmentProgress,
  individualProgress
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create CategoryCard components with the correct prop structure */}
        <CategoryCard 
          title="Admin Features"
          totalFeatures={adminFeatures.length}
          frontendPercentage={adminProgress.frontend}
          backendPercentage={adminProgress.backend}
          completedCount={adminFeatures.filter(f => f.status === 'implemented').length}
        />
        <CategoryCard 
          title="Establishment Features"
          totalFeatures={establishmentFeatures.length}
          frontendPercentage={establishmentProgress.frontend}
          backendPercentage={establishmentProgress.backend}
          completedCount={establishmentFeatures.filter(f => f.status === 'implemented').length}
        />
        <CategoryCard 
          title="Individual Features"
          totalFeatures={individualFeatures.length}
          frontendPercentage={individualProgress.frontend}
          backendPercentage={individualProgress.backend}
          completedCount={individualFeatures.filter(f => f.status === 'implemented').length}
        />
      </div>
      
      {/* Top Features in Each Category */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Recently Updated Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RecentFeaturesList 
            title="Admin"
            features={adminFeatures
              .filter(f => f.statusUpdated)
              .slice(0, 3)}
          />
          <RecentFeaturesList 
            title="Establishment"
            features={establishmentFeatures
              .filter(f => f.statusUpdated)
              .slice(0, 3)}
          />
          <RecentFeaturesList 
            title="Individual"
            features={individualFeatures
              .filter(f => f.statusUpdated)
              .slice(0, 3)}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
