
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useFeatureStatus } from './hooks/useFeatureStatus';
import { useProgressTracking } from './hooks/useProgressTracking';
import { FeatureItem } from './types';
import OverviewTab from './OverviewTab';

const DevelopmentProgressDashboard = () => {
  const { 
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures, 
    promoterFeatures 
  } = useFeatureStatus();

  const { 
    currentSnapshot, 
    monthlyProgressData,
    dataValidation 
  } = useProgressTracking(
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures, 
    promoterFeatures
  );

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
      <OverviewTab
        adminFeatures={adminFeatures}
        establishmentFeatures={establishmentFeatures}
        individualFeatures={individualFeatures}
        promoterFeatures={promoterFeatures}
        monthlyProgressData={monthlyProgressData}
        currentSnapshot={currentSnapshot}
        dataValidation={dataValidation}
      />
    </Card>
  );
};

export default DevelopmentProgressDashboard;
