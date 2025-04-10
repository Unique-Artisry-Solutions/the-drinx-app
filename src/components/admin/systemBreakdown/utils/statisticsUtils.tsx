
// Re-export all statistics utilities from their dedicated files
export { 
  calculateFeatureStatistics,
  calculateCategoryProgress
} from './featureStatistics';

export { 
  createProgressSnapshot
} from './progressSnapshot';

export {
  validateProgressData
} from './progressValidation';

export {
  generateHistoricalProgressData
} from './historicalData';
