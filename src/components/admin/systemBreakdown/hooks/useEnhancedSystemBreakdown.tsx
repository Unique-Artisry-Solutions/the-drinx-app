import { useState, useEffect, useMemo } from 'react';
import { FeatureItem, ProgressSnapshot } from '../types';
import { calculateFeatureStatistics } from '../utils/featureStatistics';
import { createProgressSnapshot } from '../utils/progressSnapshot';

export const useEnhancedSystemBreakdown = (
  adminFeatures: FeatureItem[],
  establishmentFeatures: FeatureItem[],
  individualFeatures: FeatureItem[],
  promoterFeatures: FeatureItem[]
) => {
  const [progressHistory, setProgressHistory] = useState<ProgressSnapshot[]>([]);
  const [systemHealth, setSystemHealth] = useState<'operational' | 'degraded' | 'offline'>('operational');

  // Calculate current system statistics
  const allFeatures = useMemo(() => [
    ...adminFeatures,
    ...establishmentFeatures,
    ...individualFeatures,
    ...promoterFeatures
  ], [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  const currentStats = useMemo(() => 
    calculateFeatureStatistics(allFeatures), 
    [allFeatures]
  );

  const currentSnapshot = useMemo(() => 
    createProgressSnapshot(adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures),
    [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]
  );

  // Enhanced feature analysis
  const enhancedFeatureAnalysis = useMemo(() => {
    const criticalFeatures = allFeatures.filter(f => 
      f.userImpact === 'high' && f.complexity === 'high'
    );
    
    const quickWins = allFeatures.filter(f => 
      f.userImpact === 'high' && f.complexity === 'low'
    );

    // Only use valid statuses for risk features
    const riskFeatures = allFeatures.filter(f => 
      f.complexity === 'high' && f.status === 'in_progress'
    );

    return {
      criticalFeatures,
      quickWins,
      riskFeatures,
      totalFeatures: allFeatures.length,
      completionRate: currentStats.implementationRate
    };
  }, [allFeatures, currentStats]);

  // System health monitoring (simplified - no 'blocked' status exists)
  useEffect(() => {
    const inProgressCount = allFeatures.filter(f => f.status === 'in_progress').length;
    const totalFeatures = allFeatures.length;
    const inProgressPercentage = totalFeatures > 0 ? (inProgressCount / totalFeatures) * 100 : 0;

    if (inProgressPercentage > 50) {
      setSystemHealth('degraded');
    } else if (inProgressPercentage > 75) {
      setSystemHealth('offline');
    } else {
      setSystemHealth('operational');
    }
  }, [allFeatures]);

  // Update progress history
  useEffect(() => {
    setProgressHistory(prev => {
      const newHistory = [...prev, currentSnapshot];
      // Keep only last 30 entries
      return newHistory.slice(-30);
    });
  }, [currentSnapshot]);

  return {
    currentStats,
    currentSnapshot,
    progressHistory,
    systemHealth,
    enhancedFeatureAnalysis,
    totalFeatures: allFeatures.length,
    implementedFeatures: currentStats.implementedFeatures,
    inProgressFeatures: currentStats.inProgressFeatures,
    plannedFeatures: currentStats.plannedFeatures,
    blockedFeatures: 0, // No blocked status in simplified system
    overallProgress: currentStats.implementationRate,
    confidenceScore: currentStats.confidenceScore
  };
};
