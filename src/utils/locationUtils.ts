
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
  // Handle edge cases with explicit type conversion
  const safeDistance = Number(distance);

  if (safeDistance < 0.1) {
    return 'Very close';
  } else if (safeDistance < 1) {
    // Use Math.round to avoid floating-point arithmetic issues
    const roundedDistance = Math.round(safeDistance * 10) / 10;
    return `${roundedDistance} miles`;
  } else {
    // Use toFixed and Number to ensure proper numeric handling
    const formattedDistance = Number(safeDistance.toFixed(1));
    return `${formattedDistance} miles`;
  }
}

