
import { ProgressSnapshot, MonthlyProgressData } from '../types';

/**
 * Generate synthetic historical data for timeline view when it doesn't exist
 * Returns a Promise that resolves to MonthlyProgressData[]
 */
export function generateHistoricalProgressData(
  currentSnapshot: ProgressSnapshot,
  existingHistory: ProgressSnapshot[] = []
): Promise<MonthlyProgressData[]> {
  return new Promise((resolve) => {
    // Get the current month
    const currentMonth = new Date().getMonth();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Create an array with data for months up to the current one
    let historicalData: MonthlyProgressData[] = [];
    
    // If we have some history, use that as a base
    if (existingHistory.length > 0) {
      // Map existing history to monthly data
      historicalData = existingHistory.map(snapshot => {
        const snapshotDate = new Date(snapshot.date);
        return {
          month: monthNames[snapshotDate.getMonth()],
          frontend: snapshot.frontendProgress,
          backend: snapshot.backendProgress
        };
      });
    } 
    
    // If we don't have enough historical data, generate synthetic data
    if (historicalData.length === 0) {
      // Generate synthetic data with a logical progression
      for (let i = 0; i <= currentMonth; i++) {
        const progressRatio = (i + 1) / (currentMonth + 1);
        historicalData.push({
          month: monthNames[i],
          frontend: Math.round(currentSnapshot.frontendProgress * progressRatio),
          backend: Math.round(currentSnapshot.backendProgress * progressRatio * 0.85) // Backend slightly lags frontend
        });
      }
    }
    
    // Always ensure the last entry matches our current snapshot
    if (historicalData.length > 0) {
      historicalData[historicalData.length - 1] = {
        month: monthNames[currentMonth],
        frontend: currentSnapshot.frontendProgress,
        backend: currentSnapshot.backendProgress
      };
    }
    
    resolve(historicalData);
  });
}
