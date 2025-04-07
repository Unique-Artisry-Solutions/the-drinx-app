
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FeatureItem } from './types';

// Utility function to render status badges
export const renderStatusBadge = (status: 'implemented' | 'partial' | 'planned') => {
  switch (status) {
    case 'implemented':
      return <Badge variant="default" className="bg-green-600">Implemented</Badge>;
    case 'partial':
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Partial</Badge>;
    case 'planned':
      return <Badge variant="outline" className="text-blue-600 border-blue-600">Planned</Badge>;
    default:
      return null;
  }
};

// Utility function to render access icons
export const renderAccessIcon = (hasAccess: boolean) => {
  return hasAccess ? 
    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
    <XCircle className="h-5 w-5 text-gray-300" />;
};

// Feature data calculations
export const calculateFeatureStatistics = (
  adminFeatures: FeatureItem[], 
  establishmentFeatures: FeatureItem[], 
  individualFeatures: FeatureItem[]
) => {
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures];
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const plannedFeatures = allFeatures.filter(f => f.status === 'planned').length;
  const implementationRate = Math.round((implementedFeatures / totalFeatures) * 100);

  return {
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    plannedFeatures,
    implementationRate
  };
};

// Generate CSV of all features
export const generateCSV = (adminFeatures: FeatureItem[], establishmentFeatures: FeatureItem[], individualFeatures: FeatureItem[]) => {
  // Create CSV header
  let csv = 'Feature,Description,Status,Admin Access,Establishment Access,Individual Access\n';
  
  // Add all features from all categories
  [...adminFeatures, ...establishmentFeatures, ...individualFeatures].forEach(feature => {
    const row = [
      `"${feature.name}"`,
      `"${feature.description.replace(/"/g, '""')}"`,
      feature.status,
      feature.adminAccess ? 'Yes' : 'No',
      feature.establishmentAccess ? 'Yes' : 'No',
      feature.individualAccess ? 'Yes' : 'No'
    ];
    csv += row.join(',') + '\n';
  });
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'spiritless_features.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
