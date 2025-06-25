
import { DistanceCalculator } from './interfaces';

/**
 * Implementation of the Haversine formula for calculating
 * distance between two points on a sphere (Earth)
 */
export class HaversineCalculator implements DistanceCalculator {
  private readonly earthRadius: number = 3958.8; // Radius of the Earth in miles
  
  /**
   * Calculate distance between two geographical points using Haversine formula
   * @param lat1 - Latitude of first point in degrees
   * @param lon1 - Longitude of first point in degrees
   * @param lat2 - Latitude of second point in degrees
   * @param lon2 - Longitude of second point in degrees
   * @returns Distance in miles
   */
  calculate(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.earthRadius * c;
  }
}

// Export an instance for convenience
export const haversineCalculator = new HaversineCalculator();
