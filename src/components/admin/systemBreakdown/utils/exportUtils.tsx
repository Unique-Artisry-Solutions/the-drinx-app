
import React from 'react';
import { FeatureItem, CoreFeatureCategory } from '../types';

export interface ExportData {
  id: string;
  name: string;
  description: string;
  status: string;
  category: CoreFeatureCategory;
  implementationProgress: number;
  userImpact: string;
  complexity: string;
  adminAccess: string;
  establishmentAccess: string;
  individualAccess: string;
  promoterAccess?: string;
  databaseStatus: string;
}

export const generateCSV = (features: FeatureItem[]): string => {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Status',
    'Category',
    'Implementation Progress',
    'User Impact',
    'Complexity',
    'Admin Access',
    'Establishment Access',
    'Individual Access',
    'Promoter Access',
    'Database Status'
  ];

  const rows = features.map(feature => [
    feature.id,
    feature.name,
    feature.description,
    feature.status,
    feature.category,
    feature.implementationProgress?.toString() || '0',
    feature.userImpact,
    feature.complexity,
    feature.adminAccess,
    feature.establishmentAccess,
    feature.individualAccess,
    feature.promoterAccess || 'none',
    feature.databaseStatus
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

export const downloadCSV = (csvContent: string, filename: string = 'features-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
