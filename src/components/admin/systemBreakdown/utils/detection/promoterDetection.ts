
import { FeatureItem } from '../../../types';

export const isPromoterCommunicationFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['communication', 'message', 'chat', 'contact', 'inbox', 'thread', 'conversation'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isBrandConnectionFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['brand', 'connection', 'partnership', 'sponsor', 'collaborate', 'affiliation'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isPromoterAnalyticsFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['promoter analytics', 'campaign metrics', 'audience insights', 'marketing stats', 'promoter dashboard', 'promotion performance'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isEventManagementFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['event management', 'event planning', 'event scheduling', 'venue selection', 'event creation'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isPromoterDashboardFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['promoter dashboard', 'promoter metrics', 'promoter overview'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isCustomPromotionFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['custom promotion', 'special offer', 'promotional code', 'discount', 'deal'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isPromoterNotificationFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['promoter notification', 'promoter alert', 'event alert', 'marketing notification'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

export const isTicketManagementFeature = (value: string | FeatureItem): boolean => {
  const keywords = ['ticket management', 'ticket sales', 'ticket scanning', 'ticket redemption', 'ticket validation', 'check-in', 'admission', 'entry', 'discount code'];
  const searchText = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase() + ' ' + (value.description || '').toLowerCase();
  return containsKeywords(searchText, keywords);
};

// Helper function for keyword detection
function containsKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}
