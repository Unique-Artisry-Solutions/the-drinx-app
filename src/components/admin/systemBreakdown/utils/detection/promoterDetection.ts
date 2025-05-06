import { FeatureItem } from '../../types';
import { matchesAnyKeyword } from './coreDetection';

/**
 * Checks if a feature is related to Promoter Communication functionality
 */
export const isPromoterCommunicationFeature = (feature: FeatureItem): boolean => {
  // This feature is now implemented with:
  // - Contact button on establishment pages
  // - Communication inbox and contacts list 
  // - Ability to start new conversations with venues
  // - Navigation link to venues in promoter interface
  // - Establishment communication hub for receiving and responding to messages
  
  return matchesAnyKeyword(feature, [
    'promoter communication', 
    'venue communication', 
    'messaging system',
    'promoter-venue'
  ]) || 
  (feature.id === 'venue-communication-system' || feature.id === 'contact-management') || 
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['communication', 'messaging', 'promoter-venue'].includes(tag.toLowerCase())
   ));
};

/**
 * Checks if a feature is related to Brand Connection Platform functionality
 */
export const isBrandConnectionFeature = (feature: FeatureItem): boolean => {
  // Check using the common helper function
  return matchesAnyKeyword(feature, [
    'brand connection', 
    'brand platform', 
    'brand partnership'
  ]) || 
  (feature.id === 'brand-partnerships') || 
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['brand', 'connection', 'partnership'].includes(tag.toLowerCase())
   ));
};

/**
 * Checks if a feature is related to Promoter Analytics functionality
 */
export const isPromoterAnalyticsFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'promoter analytics',
    'event performance',
    'campaign analytics'
  ]) ||
  (feature.id === 'promoter-analytics') ||
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['analytics', 'reporting', 'performance'].includes(tag.toLowerCase()) &&
     feature.id.includes('promoter')
   ));
};

/**
 * Checks if a feature is related to Event Management functionality
 */
export const isEventManagementFeature = (feature: FeatureItem): boolean => {
  // Enhanced detection for Phase 2 of Event Management implementation
  return matchesAnyKeyword(feature, [
    'event management',
    'event creation',
    'event scheduling',
    'event setup',
    'event details',
    'event configuration',
    'event media',
    'event preview',
    'custom fields'
  ]) ||
  (feature.id === 'event-management' || feature.id === 'event-details' || 
   feature.id === 'event-setup' || feature.id === 'event-media-management' ||
   feature.id === 'event-preview' || feature.id === 'event-custom-fields') ||
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['events', 'event-management', 'event-creation', 'event-setup'].includes(tag.toLowerCase())
   ));
};

/**
 * Checks if a feature is related to Promoter Dashboard functionality
 */
export const isPromoterDashboardFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'promoter dashboard',
    'promoter overview'
  ]) ||
  (feature.id === 'promoter-dashboard') ||
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['dashboard', 'overview'].includes(tag.toLowerCase()) &&
     feature.id.includes('promoter')
   ));
};

/**
 * Checks if a feature is related to Custom Promotions functionality
 */
export const isCustomPromotionFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'custom promotion',
    'promotion creation',
    'promotional tools'
  ]) ||
  (feature.id === 'custom-promotion-creation') ||
  (Array.isArray(feature.tags) && 
   feature.tags.some(tag => 
     ['promotions', 'promotion-creation'].includes(tag.toLowerCase())
   ));
};

/**
 * Checks if a feature is related to Promoter Notification functionality
 */
export const isPromoterNotificationFeature = (feature: FeatureItem): boolean => {
  const hasNotificationKeywords = matchesAnyKeyword(feature, [
    'promoter notification',
    'notification system for promoters',
    'promoter alerts',
    'promoter messaging notifications'
  ]);

  // Check for notification-specific database implementations
  const hasNotificationInfrastructure = feature.dbRequirementsText?.toLowerCase().includes('notification') &&
    feature.dbRequirementsText?.toLowerCase().includes('trigger');

  return hasNotificationKeywords || 
    (feature.id === 'promoter-notification-system') ||
    (Array.isArray(feature.tags) && 
     feature.tags.some(tag => 
       ['notifications'].includes(tag.toLowerCase()) &&
       feature.id.includes('promoter')
     )) ||
    hasNotificationInfrastructure;
};

/**
 * Detects if a feature is related to event ticket management
 */
export const isTicketManagementFeature = (feature: FeatureItem): boolean => {
  return matchesAnyKeyword(feature, [
    'ticket', 'ticketing', 'payment gateway', 'payment processing', 
    'ticket inventory', 'ticket sales', 'discount code', 'discount codes',
    'pricing', 'early bird', 'tiered pricing'
  ]) ||
  (Array.isArray(feature.tags) && 
    (feature.tags.includes('tickets') || 
     feature.tags.includes('ticketing') || 
     feature.tags.includes('payments')));
};
