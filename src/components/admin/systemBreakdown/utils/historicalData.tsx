
import { ProgressSnapshot, MonthlyProgressData } from '../types';

/**
 * Generate historical progress data for charting
 * This implementation creates simulated historical data based on the current snapshot
 */
export const generateHistoricalProgressData = async (
  snapshot: ProgressSnapshot,
  history: ProgressSnapshot[] = []
): Promise<MonthlyProgressData[]> => {
  // Use actual history if available
  if (history && history.length > 5) {
    return history
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10) // Last 10 data points
      .map((item, index) => {
        // Convert to MonthlyProgressData format
        const date = new Date(item.date);
        const month = date.toLocaleString('default', { month: 'short' });

        return {
          month,
          totalImplemented: item.implementedFeatures || 0,
          adminImplemented: Math.floor((item.adminProgress || 0) * (item.adminFeatureCount || 0) / 100) || 0,
          establishmentImplemented: Math.floor((item.establishmentProgress || 0) * (item.establishmentFeatureCount || 0) / 100) || 0,
          individualImplemented: Math.floor((item.individualProgress || 0) * (item.individualFeatureCount || 0) / 100) || 0,
          promoterImplemented: Math.floor((item.promoterProgress || 0) * (item.promoterFeatureCount || 0) / 100) || 0,
          frontend: item.frontendProgress || 0,
          backend: item.backendProgress || 0
        };
      });
  }

  // Generate mock historical data if no history is available
  const currentDate = new Date();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const data: MonthlyProgressData[] = [];
  const currentMonth = currentDate.getMonth();
  const monthsToShow = Math.min(6, currentMonth + 1);

  for (let i = 0; i < monthsToShow; i++) {
    const month = monthNames[(currentMonth - monthsToShow + i + 1 + 12) % 12];
    const progressPercentage = (i + 1) / monthsToShow;
    
    // Current progress is actual data, past is simulated
    const isCurrentMonth = i === monthsToShow - 1;
    const frontendValue = isCurrentMonth 
      ? snapshot.frontendProgress || 0 
      : Math.round((snapshot.frontendProgress || 50) * progressPercentage);
    
    const backendValue = isCurrentMonth 
      ? snapshot.backendProgress || 0 
      : Math.round((snapshot.backendProgress || 40) * progressPercentage);
    
    const adminProgress = isCurrentMonth 
      ? snapshot.adminProgress || 0 
      : Math.round((snapshot.adminProgress || 0) * progressPercentage);
    
    const establishmentProgress = isCurrentMonth 
      ? snapshot.establishmentProgress || 0 
      : Math.round((snapshot.establishmentProgress || 0) * progressPercentage);
    
    const individualProgress = isCurrentMonth 
      ? snapshot.individualProgress || 0 
      : Math.round((snapshot.individualProgress || 0) * progressPercentage);
    
    const promoterProgress = isCurrentMonth 
      ? snapshot.promoterProgress || 0 
      : Math.round((snapshot.promoterProgress || 0) * progressPercentage);

    const adminFeatureCount = snapshot.adminFeatureCount || 0;
    const establishmentFeatureCount = snapshot.establishmentFeatureCount || 0;
    const individualFeatureCount = snapshot.individualFeatureCount || 0;
    const promoterFeatureCount = snapshot.promoterFeatureCount || 0;

    data.push({
      month,
      totalImplemented: isCurrentMonth 
        ? snapshot.implementedFeatures 
        : Math.round(snapshot.implementedFeatures * progressPercentage),
      adminImplemented: Math.floor((adminProgress * adminFeatureCount) / 100),
      establishmentImplemented: Math.floor((establishmentProgress * establishmentFeatureCount) / 100),
      individualImplemented: Math.floor((individualProgress * individualFeatureCount) / 100),
      promoterImplemented: Math.floor((promoterProgress * promoterFeatureCount) / 100),
      frontend: frontendValue,
      backend: backendValue
    });
  }

  return data;
};
