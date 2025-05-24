
/**
 * Barrel export file for Navigation related types
 */

export * from './NavigationTypes';
export * from './LinkTypes';
// BreadcrumbTypes exports BreadcrumbItem which conflicts with NavigationTypes
// Re-export explicitly to resolve the ambiguity
export type { BreadcrumbItem as BreadcrumbItemType } from './BreadcrumbTypes';
