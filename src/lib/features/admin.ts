
import { FeatureId } from './registry';
import { supabase } from '@/lib/supabase';

// Associate a feature with a subscription tier
export async function associateFeatureWithTier(
  featureId: FeatureId,
  tierName: string,
  isEnabled: boolean
): Promise<void> {
  try {
    // Check if the mapping already exists
    const { data: existing } = await supabase
      .from('subscription_features')
      .select('*')
      .eq('feature_id', featureId)
      .eq('tier_id', tierName)
      .single();
      
    if (existing) {
      // Update existing mapping
      await supabase
        .from('subscription_features')
        .update({ is_enabled: isEnabled })
        .eq('id', existing.id);
    } else if (isEnabled) {
      // Only insert if enabling (no need to store disabled mappings)
      await supabase
        .from('subscription_features')
        .insert({
          feature_id: featureId,
          tier_id: tierName,
          is_enabled: true
        });
    }
  } catch (error) {
    console.error('Error updating feature tier mapping:', error);
    throw error;
  }
}

// Get all features and their tier mappings for admin UI
export async function getAllFeatureTierMappings() {
  try {
    const { data, error } = await supabase
      .from('subscription_features')
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feature tier mappings:', error);
    throw error;
  }
}
