
/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 - Latitude of first point in degrees
 * @param lon1 - Longitude of first point in degrees
 * @param lat2 - Latitude of second point in degrees
 * @param lon2 - Longitude of second point in degrees
 * @returns Distance in miles
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts a distance in miles to a user-friendly string
 */
export function formatDistance(distance: number): string {
  if (distance < 0.1) {
    return 'Very close';
  } else if (distance < 1) {
    // Fix: Ensure we're working with numeric values
    return `${(Number(distance) * 10).toFixed(0) / 10} miles`;
  } else {
    return `${Number(distance).toFixed(1)} miles`;
  }
}
