
import { DistanceCalculator } from './interfaces';

/**
 * Simple Euclidean distance calculator
 * Note: This is NOT accurate for geographical coordinates!
 * It's included as an example of the extensible architecture.
 */
export class EuclideanCalculator implements DistanceCalculator {
  private readonly scaleFactor: number = 69; // Rough miles per degree at the equator
  
  /**
   * Calculate simple Euclidean distance (not recommended for real geographic use)
   * @param lat1 - Latitude of first point in degrees
   * @param lon1 - Longitude of first point in degrees
   * @param lat2 - Latitude of second point in degrees
   * @param lon2 - Longitude of second point in degrees
   * @returns Approximate distance in miles
   */
  calculate(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const latDiff = lat2 - lat1;
    const lonDiff = lon2 - lon1;
    // Simple Euclidean distance with scaling
    return this.scaleFactor * Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  }
}

// Export an instance for convenience
export const euclideanCalculator = new EuclideanCalculator();
