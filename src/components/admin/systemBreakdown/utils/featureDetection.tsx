
import { FeatureItem } from '../types';

// Original feature detection functions
export const isFeatureFlagRelated = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('feature flag') || 
  feature.description.toLowerCase().includes('feature flag');

export const isMocktailSuggestionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('mocktail suggestion') || 
  feature.description.toLowerCase().includes('mocktail suggestion');

export const isMocktailTrendsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('trend') || 
  feature.description.toLowerCase().includes('trend');

export const isIngredientPairingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('ingredient pair') || 
  feature.description.toLowerCase().includes('ingredient pair');

export const isPromotionFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('promotion') || 
  feature.description.toLowerCase().includes('promotion') ||
  feature.name.toLowerCase().includes('promo') || 
  feature.description.toLowerCase().includes('promo');

export const isAnalyticsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('analytics') || 
  feature.description.toLowerCase().includes('analytics') ||
  feature.name.toLowerCase().includes('metric') || 
  feature.description.toLowerCase().includes('metric') ||
  feature.name.toLowerCase().includes('kpi') || 
  feature.description.toLowerCase().includes('kpi');

export const isPromotionAnalyticsFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && isAnalyticsFeature(feature);

export const isPromotionSecurityFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('secur') || 
   feature.description.toLowerCase().includes('secur'));

export const isPromotionNotificationFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('notif') || 
   feature.description.toLowerCase().includes('notif') ||
   feature.name.toLowerCase().includes('alert') || 
   feature.description.toLowerCase().includes('alert'));

export const isPromotionCreationFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('creat') || 
   feature.description.toLowerCase().includes('creat') ||
   feature.name.toLowerCase().includes('new') || 
   feature.description.toLowerCase().includes('new'));

export const isPromotionManagementFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('manage') || 
   feature.description.toLowerCase().includes('manage') ||
   feature.name.toLowerCase().includes('admin') || 
   feature.description.toLowerCase().includes('admin'));

export const isPromotionRedemptionFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('redemption') || 
   feature.description.toLowerCase().includes('redemption') ||
   feature.name.toLowerCase().includes('redeem') || 
   feature.description.toLowerCase().includes('redeem'));

export const isPromotionReportingFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('report') || 
   feature.description.toLowerCase().includes('report') ||
   feature.name.toLowerCase().includes('stats') || 
   feature.description.toLowerCase().includes('stats'));

export const isPromotionValidationFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('validat') || 
   feature.description.toLowerCase().includes('validat') ||
   feature.name.toLowerCase().includes('verif') || 
   feature.description.toLowerCase().includes('verif'));

export const isPromotionSchedulingFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('schedul') || 
   feature.description.toLowerCase().includes('schedul') ||
   feature.name.toLowerCase().includes('time') || 
   feature.description.toLowerCase().includes('time') ||
   feature.name.toLowerCase().includes('duration') || 
   feature.description.toLowerCase().includes('duration'));

export const isPromotionIntegrationFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes('integrat') || 
   feature.description.toLowerCase().includes('integrat'));

export const isPromotionAIFeature = (feature: FeatureItem) => 
  isPromotionFeature(feature) && 
  (feature.name.toLowerCase().includes(' ai') || 
   feature.description.toLowerCase().includes(' ai') ||
   feature.name.toLowerCase().includes('artificial intelligence') || 
   feature.description.toLowerCase().includes('artificial intelligence'));

export const isSystemConfigurationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('config') || 
  feature.description.toLowerCase().includes('config') ||
  feature.name.toLowerCase().includes('setting') || 
  feature.description.toLowerCase().includes('setting');

export const isUserManagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('user manage') || 
  feature.description.toLowerCase().includes('user manage') ||
  feature.name.toLowerCase().includes('user admin') || 
  feature.description.toLowerCase().includes('user admin');

export const isAuthFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('auth') || 
  feature.description.toLowerCase().includes('auth') ||
  feature.name.toLowerCase().includes('login') || 
  feature.description.toLowerCase().includes('login') ||
  feature.name.toLowerCase().includes('sign in') || 
  feature.description.toLowerCase().includes('sign in') ||
  feature.name.toLowerCase().includes('signup') || 
  feature.description.toLowerCase().includes('signup');

export const isProfileFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('profile') || 
  feature.description.toLowerCase().includes('profile');

export const isContentFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('content') || 
  feature.description.toLowerCase().includes('content');

export const isContentModerationFeature = (feature: FeatureItem) => 
  isContentFeature(feature) && 
  (feature.name.toLowerCase().includes('moderation') || 
   feature.description.toLowerCase().includes('moderation'));

export const isEstablishmentFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('establishment') || 
  feature.description.toLowerCase().includes('establishment') ||
  feature.name.toLowerCase().includes('venue') || 
  feature.description.toLowerCase().includes('venue') ||
  feature.name.toLowerCase().includes('restaurant') || 
  feature.description.toLowerCase().includes('restaurant') ||
  feature.name.toLowerCase().includes('bar') || 
  feature.description.toLowerCase().includes('bar');

export const isEstablishmentManagementFeature = (feature: FeatureItem) => 
  isEstablishmentFeature(feature) && 
  (feature.name.toLowerCase().includes('manage') || 
   feature.description.toLowerCase().includes('manage') ||
   feature.name.toLowerCase().includes('admin') || 
   feature.description.toLowerCase().includes('admin'));

export const isReviewFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('review') || 
  feature.description.toLowerCase().includes('review');

export const isPhotoFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('photo') || 
  feature.description.toLowerCase().includes('photo') ||
  feature.name.toLowerCase().includes('image') || 
  feature.description.toLowerCase().includes('image');

export const isPhotoModerationFeature = (feature: FeatureItem) => 
  isPhotoFeature(feature) && 
  (feature.name.toLowerCase().includes('moderation') || 
   feature.description.toLowerCase().includes('moderation'));

export const isSwigCircuitFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('Swig Circuit') || 
  feature.description.toLowerCase().includes('Swig Circuit');

export const isSwigCircuitManagementFeature = (feature: FeatureItem) => 
  isSwigCircuitFeature(feature) && 
  (feature.name.toLowerCase().includes('manage') || 
   feature.description.toLowerCase().includes('manage') ||
   feature.name.toLowerCase().includes('admin') || 
   feature.description.toLowerCase().includes('admin'));

export const isSwigCircuitFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('swig circuit') || 
  feature.description.toLowerCase().includes('swig circuit');

export const isThemeFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('theme') || 
  feature.description.toLowerCase().includes('theme');

export const isNotificationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('notif') || 
  feature.description.toLowerCase().includes('notif') ||
  feature.name.toLowerCase().includes('alert') || 
  feature.description.toLowerCase().includes('alert');

export const isSocialFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('social') || 
  feature.description.toLowerCase().includes('social');

export const isMapFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('map') || 
  feature.description.toLowerCase().includes('map') ||
  feature.name.toLowerCase().includes('location') || 
  feature.description.toLowerCase().includes('location');

export const isSearchFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('search') || 
  feature.description.toLowerCase().includes('search');

export const isFavoriteFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('favorite') || 
  feature.description.toLowerCase().includes('favorite');

export const isRecipeFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('recipe') || 
  feature.description.toLowerCase().includes('recipe');

export const isVisitTrackingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('visit track') || 
  feature.description.toLowerCase().includes('visit track') ||
  feature.name.toLowerCase().includes('check-in') || 
  feature.description.toLowerCase().includes('check-in') ||
  feature.name.toLowerCase().includes('checkin') || 
  feature.description.toLowerCase().includes('checkin');

export const isRewardProgramFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('reward') || 
  feature.description.toLowerCase().includes('reward') ||
  feature.name.toLowerCase().includes('loyalty') || 
  feature.description.toLowerCase().includes('loyalty');

export const isExplorationFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('explor') || 
  feature.description.toLowerCase().includes('explor') ||
  feature.name.toLowerCase().includes('discover') || 
  feature.description.toLowerCase().includes('discover');

export const isAIFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes(' ai ') || 
  feature.description.toLowerCase().includes(' ai ') ||
  feature.name.toLowerCase().includes('artificial intelligence') || 
  feature.description.toLowerCase().includes('artificial intelligence') ||
  feature.name.toLowerCase().includes('machine learning') || 
  feature.description.toLowerCase().includes('machine learning');

export const isDashboardFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('dashboard') || 
  feature.description.toLowerCase().includes('dashboard');

export const isSchedulingFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('schedul') || 
  feature.description.toLowerCase().includes('schedul') ||
  feature.name.toLowerCase().includes('calendar') || 
  feature.description.toLowerCase().includes('calendar');

export const isSystemBreakdownFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('system breakdown') || 
  feature.description.toLowerCase().includes('system breakdown');

export const isSignatureFeature = (feature: FeatureItem) => 
  feature.tags && feature.tags.includes('signature');

// New Promoter features detection functions
export const isTicketManagementFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('ticket') || 
  feature.description.toLowerCase().includes('ticket');

export const isSponsorshipFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('sponsor') || 
  feature.description.toLowerCase().includes('sponsor');

export const isVenuePartnershipFeature = (feature: FeatureItem) => 
  (feature.name.toLowerCase().includes('venue') || 
   feature.description.toLowerCase().includes('venue')) &&
  (feature.name.toLowerCase().includes('partner') || 
   feature.description.toLowerCase().includes('partner'));

export const isMerchandiseFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('merch') || 
  feature.description.toLowerCase().includes('merch');

export const isPromoterAnalyticsFeature = (feature: FeatureItem) => 
  (feature.name.toLowerCase().includes('promoter') || 
   feature.description.toLowerCase().includes('promoter')) &&
  isAnalyticsFeature(feature);

export const isAdvertisingToolsFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('advertis') || 
  feature.description.toLowerCase().includes('advertis') ||
  feature.name.toLowerCase().includes('ad placement') || 
  feature.description.toLowerCase().includes('ad placement');

export const isVIPFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('vip') || 
  feature.description.toLowerCase().includes('vip');

export const isFeedbackFeature = (feature: FeatureItem) => 
  feature.name.toLowerCase().includes('feedback') || 
  feature.description.toLowerCase().includes('feedback') ||
  feature.name.toLowerCase().includes('rating') || 
  feature.description.toLowerCase().includes('rating');
