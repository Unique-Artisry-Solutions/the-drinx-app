
// This file is now a facade that re-exports functions from statisticsUtils.tsx
// to maintain backward compatibility

import {
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
} from './statisticsUtils';

export {
  createProgressSnapshot,
  validateProgressData,
  generateHistoricalProgressData
};
