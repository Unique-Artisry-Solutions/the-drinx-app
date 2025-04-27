
import { haversineCalculator } from './distance/haversine';
import { standardFormatter } from './distance/formatter';
import { DistanceCalculator, DistanceFormatter } from './distance/interfaces';

// Default instances
let currentCalculator: DistanceCalculator = haversineCalculator;
let currentFormatter: DistanceFormatter = standardFormatter;

/**
 * Set a custom distance calculator
 * @param calculator - The distance calculator to use
 */
export function setDistanceCalculator(calculator: DistanceCalculator): void {
  currentCalculator = calculator;
}

/**
 * Set a custom distance formatter
 * @param formatter - The distance formatter to use
 */
export function setDistanceFormatter(formatter: DistanceFormatter): void {
  currentFormatter = formatter;
}

/**
 * Calculates the distance between two points using the current calculator
 * @param lat1 - Latitude of first point in degrees
 * @param lon1 - Longitude of first point in degrees
 * @param lat2 - Latitude of second point in degrees
 * @param lon2 - Longitude of second point in degrees
 * @returns Distance in miles
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return currentCalculator.calculate(lat1, lon1, lat2, lon2);
}

/**
 * Converts a distance in miles to a user-friendly string using the current formatter
 * @param distance - Distance value in miles
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  return currentFormatter.format(distance);
}
