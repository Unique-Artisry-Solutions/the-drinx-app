
import { FeatureItem } from '../types';

/**
 * Checks if a feature is related to establishment analytics
 */
export function isEstablishmentAnalyticsFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('establishment analytics') || 
    feature.name.toLowerCase().includes('venue analytics') ||
    feature.name.toLowerCase().includes('business analytics') ||
    feature.description?.toLowerCase().includes('establishment analytics') ||
    feature.description?.toLowerCase().includes('track establishment metrics') ||
    feature.description?.toLowerCase().includes('visitor analytics') ||
    feature.description?.toLowerCase().includes('revenue analytics') ||
    feature.description?.toLowerCase().includes('drink popularity')
  );
}

/**
 * Checks if a feature is related to visitor tracking
 */
export function isVisitorTrackingFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('visitor tracking') || 
    feature.name.toLowerCase().includes('visitor analytics') ||
    feature.name.toLowerCase().includes('visitor metrics') ||
    feature.description?.toLowerCase().includes('visitor tracking') ||
    feature.description?.toLowerCase().includes('visitor analytics') ||
    feature.description?.toLowerCase().includes('track visitors') ||
    feature.description?.toLowerCase().includes('visitor count') ||
    feature.description?.toLowerCase().includes('returning visitors')
  );
}

/**
 * Checks if a feature is related to revenue tracking
 */
export function isRevenueTrackingFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('revenue') || 
    feature.name.toLowerCase().includes('financial') ||
    feature.name.toLowerCase().includes('sales tracking') ||
    feature.description?.toLowerCase().includes('revenue') ||
    feature.description?.toLowerCase().includes('financial') ||
    feature.description?.toLowerCase().includes('sales tracking') ||
    feature.description?.toLowerCase().includes('transaction') ||
    feature.description?.toLowerCase().includes('earnings')
  );
}

/**
 * Checks if a feature is related to customer retention
 */
export function isCustomerRetentionFeature(feature: FeatureItem): boolean {
  return (
    feature.name.toLowerCase().includes('retention') || 
    feature.name.toLowerCase().includes('repeat customer') ||
    feature.name.toLowerCase().includes('customer loyalty') ||
    feature.description?.toLowerCase().includes('retention') ||
    feature.description?.toLowerCase().includes('repeat customer') ||
    feature.description?.toLowerCase().includes('customer loyalty') ||
    feature.description?.toLowerCase().includes('returning visitors')
  );
}

/**
 * Checks if a line of text relates to analytics database tasks
 */
export function isAnalyticsDatabaseTask(line: string): boolean {
  return line.toLowerCase().includes('establishment_analytics') ||
    line.toLowerCase().includes('visitor_sessions') ||
    line.toLowerCase().includes('revenue_entries') ||
    line.toLowerCase().includes('trend_data_points') ||
    line.toLowerCase().includes('drink_popularity_metrics') ||
    line.toLowerCase().includes('analytics table') ||
    line.toLowerCase().includes('visitor tracking table') ||
    line.toLowerCase().includes('revenue table');
}
