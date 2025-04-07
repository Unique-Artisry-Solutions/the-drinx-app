
import React from 'react';
import { 
  Check, 
  AlertCircle, 
  X, 
  CircleDashed, 
  CheckCircle, 
  Clock,
  Database as DatabaseIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  FeatureItem, 
  FeatureStatus, 
  DatabaseStatus, 
  AccessLevel,
  FeatureCategory 
} from './types';

export const renderStatusBadge = (status: FeatureStatus) => {
  switch (status) {
    case 'implemented':
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Implemented</Badge>
      );
    case 'partial':
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>
      );
    case 'planned':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Planned</Badge>;
    case 'not_started':
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>
      );
    default:
      return null;
  }
};

export const renderDatabaseStatusBadge = (status: DatabaseStatus) => {
  switch (status) {
    case 'complete':
      return (
        <Badge variant="outline" className="border-green-500 text-green-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          Complete
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case 'not_started':
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          Not Started
        </Badge>
      );
    default:
      return null;
  }
};

export const renderAccessIcon = (access: AccessLevel) => {
  switch (access) {
    case 'full':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'partial':
      return <CircleDashed className="h-5 w-5 text-amber-500" />;
    case 'none':
      return <X className="h-5 w-5 text-gray-300" />;
    case 'planned':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
};

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
  
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'complete').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in_progress').length;
  const dbNotStarted = allFeatures.filter(f => f.databaseStatus === 'not_started').length;
  
  // Calculate the implementation rate
  const implementationRate = Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100);
  const databaseCompletionRate = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
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

export function generateCSV(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
) {
  const allFeatures = [
    ...adminFeatures.map(f => ({ ...f, category: 'Admin' as FeatureCategory })),
    ...establishmentFeatures.map(f => ({ ...f, category: 'Establishment' as FeatureCategory })),
    ...individualFeatures.map(f => ({ ...f, category: 'Individual' as FeatureCategory }))
  ];
  
  const headers = [
    'Feature Name',
    'Category',
    'Description',
    'Status',
    'Database Status',
    'Admin Access',
    'Establishment Access',
    'Individual Access'
  ];
  
  const rows = allFeatures.map(feature => [
    feature.name,
    feature.category,
    feature.description,
    feature.status,
    feature.databaseStatus,
    feature.adminAccess,
    feature.establishmentAccess,
    feature.individualAccess
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `system-features-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface AnalysisStep {
  name: string;
  completed: boolean;
}

export function analyzeAllFeatures(
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[]
) {
  // This is a mocked implementation that simulates database analysis
  // In a real application, this would query the database or API
  
  // Create a copy of the features to avoid mutating the original data
  const updatedAdminFeatures = [...adminFeatures];
  const updatedEstablishmentFeatures = [...establishmentFeatures];
  const updatedIndividualFeatures = [...individualFeatures];
  
  // Mock analysis that updates some features
  const randomlyUpdateFeatures = (features: FeatureItem[]) => {
    return features.map(feature => {
      // Randomly update some features (for demo purposes)
      const shouldUpdate = Math.random() > 0.7;
      if (shouldUpdate) {
        const originalStatus = feature.status;
        const newStatus: FeatureStatus = 
          originalStatus === 'not_started' ? 'planned' :
          originalStatus === 'planned' ? 'partial' :
          originalStatus === 'partial' ? 'implemented' :
          originalStatus;
        
        return {
          ...feature,
          status: newStatus,
          statusUpdated: newStatus !== originalStatus,
          originalStatus: originalStatus !== newStatus ? originalStatus : undefined
        };
      }
      return feature;
    });
  };
  
  // Apply our mock analysis
  const analyzedAdminFeatures = randomlyUpdateFeatures(updatedAdminFeatures);
  const analyzedEstablishmentFeatures = randomlyUpdateFeatures(updatedEstablishmentFeatures);
  const analyzedIndividualFeatures = randomlyUpdateFeatures(updatedIndividualFeatures);
  
  // Track completed analysis steps
  const completedSteps: AnalysisStep[] = [
    { name: 'Database schema verification', completed: true },
    { name: 'API endpoints validation', completed: true },
    { name: 'Authentication flow check', completed: true },
    { name: 'User permissions validation', completed: true },
    { name: 'Content moderation implementation', completed: true },
    { name: 'Storage bucket configuration', completed: true },
    { name: 'Database trigger functions verification', completed: true },
    { name: 'Frontend component implementation check', completed: true }
  ];
  
  return {
    adminFeatures: analyzedAdminFeatures,
    establishmentFeatures: analyzedEstablishmentFeatures,
    individualFeatures: analyzedIndividualFeatures,
    completedSteps
  };
}
