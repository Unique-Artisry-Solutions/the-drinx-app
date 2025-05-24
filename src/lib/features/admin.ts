
import { supabase } from '@/lib/supabase';
import { FeatureId, FEATURES, featureRegistry, featuresByTier } from './registry';
import { 
  createFeatureFlag as apiCreateFeatureFlag,
  deleteFeatureFlag as apiDeleteFeatureFlag,
  associateFeatureWithTier as apiAssociateFeatureWithTier
} from './api';

// Re-export functions from api.ts
export const createFeatureFlag = apiCreateFeatureFlag;
export const deleteFeatureFlag = apiDeleteFeatureFlag;
export const associateFeatureWithTier = apiAssociateFeatureWithTier;

/**
 * Creates or updates feature flags in the database to match the registry
 */
export async function syncFeaturesToDatabase(): Promise<void> {
  try {
    // Get all features from the registry
    const featureIds = Object.values(FEATURES);
    
    for (const featureId of featureIds) {
      const feature = featureRegistry[featureId];
      
      // Check if feature exists in database
      const { data: existingFeature } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('name', featureId)
        .single();
      
      if (!existingFeature) {
        // Create new feature flag
        await supabase
          .from('feature_flags')
          .insert({
            name: featureId,
            description: feature.description,
            status: feature.defaultEnabled
          });
      }
      
      // Now sync the subscription tiers for this feature
      await syncFeatureSubscriptionTiers(featureId);
    }
  } catch (error) {
    console.error('Error syncing features to database:', error);
    throw error;
  }
}

/**
 * Syncs the subscription tiers for a specific feature
 */
async function syncFeatureSubscriptionTiers(featureId: FeatureId): Promise<void> {
  try {
    // Get feature info
    const { data: featureData } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('name', featureId)
      .single();
    
    if (!featureData?.id) {
      throw new Error(`Feature ${featureId} not found in database`);
    }
    
    // Find which tiers should have this feature
    const tierEntries = Object.entries(featuresByTier);
    
    for (const [tier, features] of tierEntries) {
      const isEnabled = features.includes(featureId);
      
      // Check if mapping already exists
      const { data: existingMapping } = await supabase
        .from('subscription_features')
        .select('*')
        .eq('feature_id', featureData.id)
        .eq('tier_id', tier)
        .single();
      
      if (!existingMapping) {
        // Create new mapping
        await supabase
          .from('subscription_features')
          .insert({
            feature_id: featureData.id,
            tier_id: tier,
            is_enabled: isEnabled
          });
      } else if (existingMapping.is_enabled !== isEnabled) {
        // Update existing mapping if enabled status changed
        await supabase
          .from('subscription_features')
          .update({ is_enabled: isEnabled })
          .eq('id', existingMapping.id);
      }
    }
  } catch (error) {
    console.error(`Error syncing subscription tiers for feature ${featureId}:`, error);
    throw error;
  }
}

/**
 * Gets all feature flags from database
 */
export async function getAllFeatureFlags() {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    throw error;
  }
}

/**
 * Updates a feature flag in the database
 */
export async function updateFeatureFlag(featureId: string, updates: {
  status?: boolean;
  description?: string;
  segment_id?: string | null;
  percentage_rollout?: number | null;
}) {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .update(updates)
      .eq('id', featureId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating feature flag:', error);
    throw error;
  }
}
