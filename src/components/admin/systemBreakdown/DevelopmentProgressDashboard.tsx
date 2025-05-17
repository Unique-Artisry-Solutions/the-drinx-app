
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useFeatureStatus } from './hooks/useFeatureStatus';
import { useProgressTracking } from './hooks/useProgressTracking';
import { FeatureItem } from './types';

const DevelopmentProgressDashboard = ({ 
  adminFeatures, 
  establishmentFeatures, 
  individualFeatures, 
  promoterFeatures,
  monthlyProgressData,
  currentSnapshot
}) => {
  const [needsAttentionFeatures, setNeedsAttentionFeatures] = useState<FeatureItem[]>([]);

  // Calculate overview statistics
  useEffect(() => {
    // Find features needing attention
    const inProgressFeatures = [
      ...adminFeatures.filter(f => f.status === 'in_progress'),
      ...establishmentFeatures.filter(f => f.status === 'in_progress'),
      ...individualFeatures.filter(f => f.status === 'in_progress'),
      ...promoterFeatures.filter(f => f.status === 'in_progress')
    ];
    
    const blockingFeatures = [
      ...adminFeatures.filter(f => f.status === 'blocked'),
      ...establishmentFeatures.filter(f => f.status === 'blocked'),
      ...individualFeatures.filter(f => f.status === 'blocked'),
      ...promoterFeatures.filter(f => f.status === 'blocked')
    ];
    
    const inconsistentFeatures = [
      ...adminFeatures.filter(f => f.status === 'implemented' && f.databaseStatus !== 'completed'),
      ...establishmentFeatures.filter(f => f.status === 'implemented' && f.databaseStatus !== 'completed'),
      ...individualFeatures.filter(f => f.status === 'implemented' && f.databaseStatus !== 'completed'),
      ...promoterFeatures.filter(f => f.status === 'implemented' && f.databaseStatus !== 'completed')
    ];
    
    // Prioritized list of features needing attention
    const needsAttentionList = [
      ...blockingFeatures,
      ...inconsistentFeatures,
      ...inProgressFeatures
    ].slice(0, 5); // Just show the top 5
    
    setNeedsAttentionFeatures(needsAttentionList);
  }, [adminFeatures, establishmentFeatures, individualFeatures, promoterFeatures]);

  if (!currentSnapshot) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          Loading dashboard data...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Development Progress Dashboard</h3>
        
        {/* Status summary section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">Implementation Status</h4>
            <div className="space-y-2">
              {currentSnapshot && (
                <>
                  <div className="flex justify-between">
                    <span>Total Features:</span>
                    <span className="font-medium">{currentSnapshot.totalFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Implemented:</span>
                    <span className="font-medium">{currentSnapshot.implementedFeatures} 
                      <span className="text-sm text-muted-foreground ml-1">
                        ({Math.round(currentSnapshot.implementationPercentage)}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="font-medium">{currentSnapshot.inProgressFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planned:</span>
                    <span className="font-medium">{currentSnapshot.plannedFeatures}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">Features Needing Attention</h4>
            {needsAttentionFeatures.length > 0 ? (
              <ul className="space-y-1">
                {needsAttentionFeatures.map(feature => (
                  <li key={feature.id} className="text-sm">
                    • <span className="font-medium">{feature.name}</span> 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({feature.status})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No features currently need attention</p>
            )}
          </div>
        </div>
        
        {/* Monthly progress section */}
        {monthlyProgressData && monthlyProgressData.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Monthly Implementation Progress</h4>
            <div className="h-64 bg-muted/30 rounded-md p-4">
              {/* Here you would typically render a chart with the monthlyProgressData */}
              <p className="text-sm text-muted-foreground">
                Progress data available for {monthlyProgressData.length} months
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {monthlyProgressData.slice(-3).map((data, i) => (
                  <div key={i} className="bg-background p-2 rounded border">
                    <div className="text-xs text-muted-foreground">{data.month}</div>
                    <div className="font-medium">{data.implementedCount} implemented</div>
                    <div className="text-xs">({data.implementationRate}% increase)</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DevelopmentProgressDashboard;
