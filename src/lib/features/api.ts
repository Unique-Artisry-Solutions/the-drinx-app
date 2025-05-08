
import { supabase } from '@/lib/supabase';
import { FEATURES, FeatureId } from './registry';

/**
 * Check if a feature flag is enabled for the current user
 */
export async function checkFeatureAccess(featureId: FeatureId): Promise<boolean> {
  try {
    // First check if the user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false; // Not logged in, no access
    }

    // Call the database function to check feature access
    const { data, error } = await supabase.rpc(
      'check_feature_access',
      { p_feature_name: featureId }
    );

    if (error) {
      console.error('Error checking feature access:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkFeatureAccess:', error);
    return false;
  }
}

/**
 * Track feature usage or interaction
 */
export async function trackFeatureEvent(featureId: FeatureId, eventType: string, eventData: Record<string, any> = {}): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return; // Not logged in, can't track
    }

    // Get the feature ID
    const { data: featureData } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('name', featureId)
      .single();

    if (!featureData?.id) {
      console.error(`Feature ${featureId} not found in database`);
      return;
    }

    // Insert the metrics record
    const { error } = await supabase
      .from('feature_metrics')
      .insert({
        feature_id: featureData.id,
        user_id: session.user.id,
        event_type: eventType,
        event_data: eventData
      });

    if (error) {
      console.error('Error tracking feature event:', error);
    }
  } catch (error) {
    console.error('Error in trackFeatureEvent:', error);
  }
}
