
import { useMemo } from 'react';

export interface CodeMetrics {
  totalLines: number;
  duplicateLines: number;
  reducedLines: number;
  reductionPercentage: number;
}

export interface PageMetrics {
  pageName: string;
  beforeLines: number;
  afterLines: number;
  reduction: number;
  reductionPercentage: number;
  status: 'pending' | 'migrated' | 'optimized';
}

export const useAdminCodeReduction = () => {
  const pageMetrics: PageMetrics[] = useMemo(() => [
    {
      pageName: 'AdminDashboard',
      beforeLines: 180,
      afterLines: 120,
      reduction: 60,
      reductionPercentage: 33,
      status: 'migrated',
    },
    {
      pageName: 'SystemConfiguration',
      beforeLines: 250,
      afterLines: 150,
      reduction: 100,
      reductionPercentage: 40,
      status: 'pending',
    },
    {
      pageName: 'UserManagement',
      beforeLines: 320,
      afterLines: 200,
      reduction: 120,
      reductionPercentage: 38,
      status: 'pending',
    },
    {
      pageName: 'Analytics',
      beforeLines: 280,
      afterLines: 180,
      reduction: 100,
      reductionPercentage: 36,
      status: 'pending',
    },
    {
      pageName: 'PhotoModeration',
      beforeLines: 190,
      afterLines: 110,
      reduction: 80,
      reductionPercentage: 42,
      status: 'pending',
    },
  ], []);

  const overallMetrics: CodeMetrics = useMemo(() => {
    const totalBefore = pageMetrics.reduce((sum, page) => sum + page.beforeLines, 0);
    const totalAfter = pageMetrics.reduce((sum, page) => sum + page.afterLines, 0);
    const migratedPages = pageMetrics.filter(page => page.status === 'migrated');
    const actualReduction = migratedPages.reduce((sum, page) => sum + page.reduction, 0);
    
    return {
      totalLines: totalBefore,
      duplicateLines: totalBefore - totalAfter,
      reducedLines: actualReduction,
      reductionPercentage: Math.round((actualReduction / totalBefore) * 100),
    };
  }, [pageMetrics]);

  const projectedReduction = useMemo(() => {
    const totalReduction = pageMetrics.reduce((sum, page) => sum + page.reduction, 0);
    const totalBefore = pageMetrics.reduce((sum, page) => sum + page.beforeLines, 0);
    
    return {
      totalReduction,
      projectedPercentage: Math.round((totalReduction / totalBefore) * 100),
    };
  }, [pageMetrics]);

  return {
    pageMetrics,
    overallMetrics,
    projectedReduction,
  };
};
