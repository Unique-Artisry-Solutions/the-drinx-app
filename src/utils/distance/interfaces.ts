
/**
 * Interface for distance calculation algorithms
 */
export interface DistanceCalculator {
  /**
   * Calculate distance between two geographical points
   * @param lat1 - Latitude of first point in degrees
   * @param lon1 - Longitude of first point in degrees
   * @param lat2 - Latitude of second point in degrees
   * @param lon2 - Longitude of second point in degrees
   * @returns Distance in miles
   */
  calculate(lat1: number, lon1: number, lat2: number, lon2: number): number;
}

/**
 * Interface for distance formatters
 */
export interface DistanceFormatter {
  /**
   * Format a distance value with appropriate units
   * @param distance - Distance value in miles
   * @returns Formatted distance string
   */
  format(distance: number): string;
}
