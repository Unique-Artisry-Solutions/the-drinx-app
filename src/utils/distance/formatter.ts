
import { DistanceFormatter } from './interfaces';

/**
 * Standard distance formatter
 */
export const standardFormatter: DistanceFormatter = {
  format: (distance: number): string => {
    if (distance < 0.1) {
      return "< 0.1 mi";
    } else if (distance < 1) {
      return `${distance.toFixed(1)} mi`;
    } else {
      return `${distance.toFixed(1)} mi`;
    }
  }
};
