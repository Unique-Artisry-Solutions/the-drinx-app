
import { useState, useEffect, useMemo } from 'react';
import { FeatureItem, ProgressSnapshot } from '../types';
import { calculateFeatureStats, groupFeaturesByCategory } from '../utils/SimpleFeatureDetection';

export const useEnhancedSystemBreakdown = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) => {
  const [systemHealth, setSystemHealth] = useState<'operational' | 'degraded' | 'offline'>('operational');

  // Calculate current system statistics using simplified approach
  const allFeatures = useMemo(() => [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ], [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  const currentStats = useMemo(() => 
    calculateFeatureStats(allFeatures), 
    [allFeatures]
  );

  // Simple feature categorization
  const featuresByCategory = useMemo(() => 
    groupFeaturesByCategory(allFeatures),
    [allFeatures]
  );

  // Enhanced feature analysis with simplified logic
  const enhancedFeatureAnalysis = useMemo(() => {
    const criticalFeatures = allFeatures.filter(f => 
      f.userImpact === 'high' && f.complexity === 'high'
    );
    
    const quickWins = allFeatures.filter(f => 
      f.userImpact === 'high' && f.complexity === 'low'
    );

    const riskFeatures = allFeatures.filter(f => 
      f.status === 'blocked' || 
      (f.complexity === 'high' && f.status === 'in_progress')
    );

    return {
      criticalFeatures,
      quickWins,
      riskFeatures,
      totalFeatures: allFeatures.length,
      completionRate: currentStats.completionRate,
      featuresByCategory
    };
  }, [allFeatures, currentStats, featuresByCategory]);

  // Simple system health monitoring
  useEffect(() => {
    const blockedPercentage = currentStats.total > 0 ? (currentStats.blocked / currentStats.total) * 100 : 0;

    if (blockedPercentage > 25) {
      setSystemHealth('offline');
    } else if (blockedPercentage > 10) {
      setSystemHealth('degraded');
    } else {
      setSystemHealth('operational');
    }
  }, [currentStats]);

  return {
    currentStats,
    systemHealth,
    enhancedFeatureAnalysis,
    totalFeatures: allFeatures.length,
    implementedFeatures: currentStats.implemented,
    inProgressFeatures: currentStats.inProgress,
    plannedFeatures: currentStats.planned,
    blockedFeatures: currentStats.blocked,
    overallProgress: currentStats.completionRate,
    confidenceScore: 85 // Static confidence score for simplicity
  };
};
