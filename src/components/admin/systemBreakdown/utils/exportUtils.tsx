
import { FeatureItem } from '../types';

// Define a simple category type to use in this file
type FeatureCategory = 'Admin' | 'Establishment' | 'Individual' | 'Promoter';

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
