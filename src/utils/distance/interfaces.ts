
/**
 * Interface for distance calculation implementations
 */
export interface DistanceCalculator {
  calculate(lat1: number, lon1: number, lat2: number, lon2: number): number;
}

/**
 * Interface for distance formatting implementations
 */
export interface DistanceFormatter {
  format(distance: number): string;
}
