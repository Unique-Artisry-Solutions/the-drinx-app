
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  // Implementation of the Haversine formula for calculating distance between two points on Earth
  const toRadian = (degree: number) => degree * Math.PI / 180;
  
  const earthRadius = 3958.8; // Earth radius in miles
  
  const latDiff = toRadian(lat2 - lat1);
  const lngDiff = toRadian(lon2 - lon1);
  
  const a = 
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * 
    Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return parseFloat(distance.toFixed(1));
}
