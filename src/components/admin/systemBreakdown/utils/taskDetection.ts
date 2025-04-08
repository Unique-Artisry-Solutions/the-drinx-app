
/**
 * Collection of utility functions to detect specific types of database tasks
 */

/**
 * Checks if a line of text relates to feature flags or metrics
 */
export const isFeatureFlagTask = (line: string): boolean => {
  return line.toLowerCase().includes('feature flag') || 
    line.toLowerCase().includes('feature toggle') ||
    line.toLowerCase().includes('feature metric') || 
    line.toLowerCase().includes('ab test') ||
    line.toLowerCase().includes('a/b test') ||
    line.toLowerCase().includes('percentage rollout') ||
    line.toLowerCase().includes('user segment');
};

/**
 * Checks if a line of text relates to mocktail suggestions
 */
export const isMocktailSuggestionTask = (line: string): boolean => {
  return line.toLowerCase().includes('mocktail_suggestion') ||
    line.toLowerCase().includes('mocktail trend') ||
    line.toLowerCase().includes('suggestion_feedback') ||
    line.toLowerCase().includes('ingredient_pairing') ||
    line.toLowerCase().includes('ai model parameter') ||
    line.toLowerCase().includes('seasonal_trend_analysis');
};

/**
 * Checks if a line of text relates to mocktail trends
 */
export const isMocktailTrendTask = (line: string): boolean => {
  return line.toLowerCase().includes('mocktail_trend') ||
    line.toLowerCase().includes('ingredient trend') ||
    line.toLowerCase().includes('trend_analysis') ||
    line.toLowerCase().includes('seasonal_trend') ||
    line.toLowerCase().includes('popularity tracking') ||
    line.toLowerCase().includes('trend score');
};

/**
 * Checks if a line of text relates to ingredient pairings
 */
export const isIngredientPairingTask = (line: string): boolean => {
  return line.toLowerCase().includes('ingredient_pairing') ||
    line.toLowerCase().includes('pairing_score') ||
    line.toLowerCase().includes('complementary ingredient') ||
    line.toLowerCase().includes('flavor combination');
};

/**
 * Checks if a line of text relates to promotions
 */
export const isPromotionTask = (line: string): boolean => {
  return line.toLowerCase().includes('establishment_promotions') ||
    line.toLowerCase().includes('promotion_redemptions') ||
    line.toLowerCase().includes('promotion_analytics') ||
    line.toLowerCase().includes('promotion') && line.toLowerCase().includes('table') ||
    line.toLowerCase().includes('discount') ||
    line.toLowerCase().includes('special offer') ||
    line.toLowerCase().includes('validation trigger') && line.toLowerCase().includes('promotion') ||
    line.toLowerCase().includes('notification') && line.toLowerCase().includes('promotion') ||
    line.toLowerCase().includes('expiring promotion');
};

/**
 * Checks if a line of text relates to analytics tasks
 */
export const isAnalyticsTask = (line: string): boolean => {
  return line.toLowerCase().includes('analytics') ||
    line.toLowerCase().includes('analytics_event') ||
    line.toLowerCase().includes('user_activity') ||
    line.toLowerCase().includes('event tracking') ||
    line.toLowerCase().includes('metrics collection') ||
    line.toLowerCase().includes('data visualization') ||
    line.toLowerCase().includes('dashboard') ||
    line.toLowerCase().includes('reporting');
};

/**
 * Checks if a task is considered completed based on its text
 */
export const isTaskCompleted = (line: string): boolean => {
  return isFeatureFlagTask(line) || 
    isMocktailSuggestionTask(line) || 
    isMocktailTrendTask(line) || 
    isIngredientPairingTask(line) ||
    isPromotionTask(line) ||
    isAnalyticsTask(line) ||
    (
      !line.toLowerCase().includes('need') && 
      !line.toLowerCase().includes('required') &&
      !line.toLowerCase().includes('add') &&
      !line.toLowerCase().includes('create') &&
      !line.toLowerCase().includes('implement') &&
      !line.toLowerCase().includes('todo')
    );
};
