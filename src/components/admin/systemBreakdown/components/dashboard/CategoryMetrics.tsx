
import React from 'react';

interface CategoryMetricsProps {
  adminFeatures: { length: number };
  establishmentFeatures: { length: number };
  individualFeatures: { length: number };
  promoterFeatures: { length: number };
}

export const CategoryMetrics: React.FC<CategoryMetricsProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-lg font-medium">{adminFeatures.length}</div>
        <div className="text-sm text-gray-600">Admin Features</div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-lg font-medium">{establishmentFeatures.length}</div>
        <div className="text-sm text-gray-600">Establishment Features</div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-lg font-medium">{individualFeatures.length}</div>
        <div className="text-sm text-gray-600">Individual Features</div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-lg font-medium">{promoterFeatures.length}</div>
        <div className="text-sm text-gray-600">Promoter Features</div>
      </div>
    </div>
  );
};
