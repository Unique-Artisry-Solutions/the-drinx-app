
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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

// Utility function to render database status badges
export const renderDatabaseStatusBadge = (status?: 'completed' | 'in-progress' | 'not-started') => {
  switch (status) {
    case 'completed':
      return <div className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> <span>Completed</span></div>;
    case 'in-progress':
      return <div className="flex items-center"><AlertCircle className="h-4 w-4 mr-1 text-amber-500" /> <span>In Progress</span></div>;
    case 'not-started':
      return <div className="flex items-center"><XCircle className="h-4 w-4 mr-1 text-gray-400" /> <span>Not Started</span></div>;
    default:
      return <span className="text-gray-400">Unknown</span>;
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
  
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'completed').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in-progress').length;
  const dbNotStarted = allFeatures.filter(f => f.databaseStatus === 'not-started').length;
  
  const implementationRate = Math.round((implementedFeatures / totalFeatures) * 100);
  const databaseCompletionRate = Math.round((dbCompleted / totalFeatures) * 100);

  return {
    totalFeatures,
    implementedFeatures,
    partialFeatures,
    plannedFeatures,
    dbCompleted,
    dbInProgress,
    dbNotStarted,
    implementationRate,
    databaseCompletionRate
  };
};

// Generate CSV of all features
export const generateCSV = (adminFeatures: FeatureItem[], establishmentFeatures: FeatureItem[], individualFeatures: FeatureItem[]) => {
  // Create CSV header
  let csv = 'Feature,Description,Status,Database Status,Admin Access,Establishment Access,Individual Access,Test Steps\n';
  
  // Add all features from all categories
  [...adminFeatures, ...establishmentFeatures, ...individualFeatures].forEach(feature => {
    const testStepsFormatted = feature.testSteps ? 
      `"${feature.testSteps.map((step, i) => `${i+1}. ${step}`).join('\n')}"` : 
      '""';
      
    const row = [
      `"${feature.name}"`,
      `"${feature.description.replace(/"/g, '""')}"`,
      feature.status,
      feature.databaseStatus || 'unknown',
      feature.adminAccess ? 'Yes' : 'No',
      feature.establishmentAccess ? 'Yes' : 'No',
      feature.individualAccess ? 'Yes' : 'No',
      testStepsFormatted
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
