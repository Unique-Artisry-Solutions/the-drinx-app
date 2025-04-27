
import { calculateHaversineDistance } from './distance/haversine';
import { formatDistanceValue } from './distance/formatter';

/**
 * Calculates the distance between two points
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return calculateHaversineDistance(lat1, lon1, lat2, lon2);
}

/**
 * Converts a distance in miles to a user-friendly string
 */
export function formatDistance(distance: number): string {
  return formatDistanceValue(distance);
}
