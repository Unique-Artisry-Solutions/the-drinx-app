
/**
 * Formats a distance value with proper rounding and units
 */
export function formatDistanceValue(distance: number): string {
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
