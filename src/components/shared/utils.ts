
// Shared component utilities for consistent behavior

import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

// Standard className merging utility
export function mergeClassNames(...classes: ClassValue[]) {
  return cn(...classes);
}

// Standard padding classes
export const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
} as const;

// Standard max-width classes
export const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-none'
} as const;

// Standard loading component
export const StandardLoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  </div>
);

// Standard error component
export const StandardErrorDisplay = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) => (
  <div className="text-center py-8">
    <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
    <p className="text-gray-600 mb-4">{error}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    )}
  </div>
);

// Standard prop forwarding utility
export function forwardStandardProps<T extends Record<string, any>>(
  props: T,
  exclude: (keyof T)[] = []
): Omit<T, keyof typeof exclude[number]> {
  const result = { ...props };
  exclude.forEach(key => delete result[key]);
  return result;
}

// Standard responsive helper
export function getResponsiveClasses(
  mobile: string,
  desktop?: string
): string {
  return desktop ? `${mobile} md:${desktop}` : mobile;
}
