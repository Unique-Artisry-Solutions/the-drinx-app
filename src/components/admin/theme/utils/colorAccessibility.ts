
/**
 * Utility functions for checking color accessibility according to WCAG standards
 */

/**
 * Calculate the relative luminance of a color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

  // Handle both 3-digit and 6-digit hex codes
  const expandedHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('') 
    : hex;
  
  // Convert to RGB
  const r = parseInt(expandedHex.slice(0, 2), 16) / 255;
  const g = parseInt(expandedHex.slice(2, 4), 16) / 255;
  const b = parseInt(expandedHex.slice(4, 6), 16) / 255;
  
  // Calculate luminance
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate contrast ratio between two colors
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (e) {
    console.error('Error calculating contrast ratio:', e);
    return 1; // Return lowest possible contrast ratio on error
  }
}

/**
 * Check if a color combination meets WCAG AA standard
 * - Normal text (< 18pt): minimum ratio of 4.5:1
 * - Large text (>= 18pt): minimum ratio of 3:1
 */
export function meetsWCAGAA(color1: string, color2: string, isLargeText = false): boolean {
  try {
    const ratio = getContrastRatio(color1, color2);
    return ratio >= (isLargeText ? 3 : 4.5);
  } catch (e) {
    console.error('Error checking WCAG AA compliance:', e);
    return false;
  }
}

/**
 * Check if a color combination meets WCAG AAA standard
 * - Normal text (< 18pt): minimum ratio of 7:1
 * - Large text (>= 18pt): minimum ratio of 4.5:1
 */
export function meetsWCAGAAA(color1: string, color2: string, isLargeText = false): boolean {
  try {
    const ratio = getContrastRatio(color1, color2);
    return ratio >= (isLargeText ? 4.5 : 7);
  } catch (e) {
    console.error('Error checking WCAG AAA compliance:', e);
    return false;
  }
}

/**
 * Get WCAG compliance level for a color combination
 */
export function getComplianceLevel(color1: string, color2: string, isLargeText = false): 'AAA' | 'AA' | 'Fail' {
  try {
    if (meetsWCAGAAA(color1, color2, isLargeText)) {
      return 'AAA';
    } else if (meetsWCAGAA(color1, color2, isLargeText)) {
      return 'AA';
    } else {
      return 'Fail';
    }
  } catch (e) {
    console.error('Error determining compliance level:', e);
    return 'Fail';
  }
}

/**
 * Check if a set of text and background colors meet accessibility standards
 */
export function checkColorAccessibility(textColor: string, backgroundColor: string): {
  normalText: { ratio: number, level: 'AAA' | 'AA' | 'Fail' },
  largeText: { ratio: number, level: 'AAA' | 'AA' | 'Fail' }
} {
  try {
    const ratio = getContrastRatio(textColor, backgroundColor);
    
    return {
      normalText: {
        ratio: parseFloat(ratio.toFixed(2)),
        level: getComplianceLevel(textColor, backgroundColor, false)
      },
      largeText: {
        ratio: parseFloat(ratio.toFixed(2)),
        level: getComplianceLevel(textColor, backgroundColor, true)
      }
    };
  } catch (e) {
    console.error('Error checking color accessibility:', e);
    return {
      normalText: { ratio: 1, level: 'Fail' },
      largeText: { ratio: 1, level: 'Fail' }
    };
  }
}

/**
 * Determine if a color is light or dark (useful for choosing text color)
 * @returns true if the color is light, false if dark
 */
export function isLightColor(hexColor: string): boolean {
  const luminance = getLuminance(hexColor);
  return luminance > 0.5;
}

/**
 * Get recommended text color (black or white) based on background color
 */
export function getRecommendedTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
