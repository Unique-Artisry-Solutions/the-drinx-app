
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
  
  // Convert to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
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
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standard
 * - Normal text (< 18pt): minimum ratio of 4.5:1
 * - Large text (>= 18pt): minimum ratio of 3:1
 */
export function meetsWCAGAA(color1: string, color2: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= (isLargeText ? 3 : 4.5);
}

/**
 * Check if a color combination meets WCAG AAA standard
 * - Normal text (< 18pt): minimum ratio of 7:1
 * - Large text (>= 18pt): minimum ratio of 4.5:1
 */
export function meetsWCAGAAA(color1: string, color2: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= (isLargeText ? 4.5 : 7);
}

/**
 * Get WCAG compliance level for a color combination
 */
export function getComplianceLevel(color1: string, color2: string, isLargeText = false): 'AAA' | 'AA' | 'Fail' {
  if (meetsWCAGAAA(color1, color2, isLargeText)) {
    return 'AAA';
  } else if (meetsWCAGAA(color1, color2, isLargeText)) {
    return 'AA';
  } else {
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
  const ratio = getContrastRatio(textColor, backgroundColor);
  
  return {
    normalText: {
      ratio,
      level: getComplianceLevel(textColor, backgroundColor, false)
    },
    largeText: {
      ratio,
      level: getComplianceLevel(textColor, backgroundColor, true)
    }
  };
}
