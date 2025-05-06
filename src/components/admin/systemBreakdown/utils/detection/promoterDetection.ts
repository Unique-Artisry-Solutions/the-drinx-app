export const isPromoterCommunicationFeature = (value: string): boolean => {
  const keywords = ['communication', 'message', 'chat', 'contact', 'inbox', 'thread', 'conversation'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isBrandConnectionFeature = (value: string): boolean => {
  const keywords = ['brand', 'connection', 'partnership', 'sponsor', 'collaborate', 'affiliation'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isPromoterAnalyticsFeature = (value: string): boolean => {
  const keywords = ['promoter analytics', 'campaign metrics', 'audience insights', 'marketing stats', 'promoter dashboard', 'promotion performance'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isEventManagementFeature = (value: string): boolean => {
  const keywords = ['event management', 'event planning', 'event scheduling', 'venue selection', 'event creation'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isPromoterDashboardFeature = (value: string): boolean => {
  const keywords = ['promoter dashboard', 'promoter metrics', 'promoter overview'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isCustomPromotionFeature = (value: string): boolean => {
  const keywords = ['custom promotion', 'special offer', 'promotional code', 'discount', 'deal'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isPromoterNotificationFeature = (value: string): boolean => {
  const keywords = ['promoter notification', 'promoter alert', 'event alert', 'marketing notification'];
  return containsKeywords(value.toLowerCase(), keywords);
};

export const isTicketManagementFeature = (value: string): boolean => {
  const keywords = ['ticket management', 'ticket sales', 'ticket scanning', 'ticket redemption', 'ticket validation', 'check-in', 'admission', 'entry', 'discount code'];
  return containsKeywords(value.toLowerCase(), keywords);
};

// Helper function for keyword detection
function containsKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}
