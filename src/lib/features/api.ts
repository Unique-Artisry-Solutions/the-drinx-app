import { supabase } from '@/lib/supabase';
import { FEATURES, FeatureId } from './registry';
import { getCachedFeatureAccess, cacheFeatureAccess } from './cache';

/**
 * Check if a feature flag is enabled for the current user
 * (Optimized version with caching)
 */
export async function checkFeatureAccess(featureId: FeatureId): Promise<boolean> {
  try {
    // First check if the user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false; // Not logged in, no access
    }

    const userId = session.user.id;
    
    // Check cache first
    const cachedAccess = getCachedFeatureAccess(userId, featureId);
    if (cachedAccess !== null) {
      return cachedAccess;
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

    // Cache the result
    const hasAccess = !!data;
    cacheFeatureAccess(userId, featureId, hasAccess);
    
    return hasAccess;
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

/**
 * Batch check feature access for multiple features at once
 * (Optimized version with caching and batching)
 */
export async function batchCheckFeatureAccess(featureIds: FeatureId[]): Promise<Record<FeatureId, boolean>> {
  // First check if the user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  if (!userId) {
    // Return all features as false if not logged in
    return featureIds.reduce((acc, featureId) => {
      acc[featureId] = false;
      return acc;
    }, {} as Record<FeatureId, boolean>);
  }
  
  const result: Record<FeatureId, boolean> = {} as Record<FeatureId, boolean>;
  const featuresToCheck: FeatureId[] = [];
  
  // Check cache first for each feature
  for (const featureId of featureIds) {
    const cachedAccess = getCachedFeatureAccess(userId, featureId);
    if (cachedAccess !== null) {
      result[featureId] = cachedAccess;
    } else {
      featuresToCheck.push(featureId);
    }
  }
  
  // If all features were in cache, return the result
  if (featuresToCheck.length === 0) {
    return result;
  }
  
  // Otherwise, check remaining features
  for (const featureId of featuresToCheck) {
    const hasAccess = await checkFeatureAccess(featureId);
    result[featureId] = hasAccess;
  }
  
  return result;
}

/**
 * Get feature metrics for a specific feature
 */
export async function getFeatureMetrics(featureId: FeatureId): Promise<any> {
  try {
    // First check if the user is logged in and is an admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('Not authorized');
    }

    // Get the user's role (assuming it's stored in user_metadata)
    const userType = session.user.user_metadata?.user_type;
    if (userType !== 'admin') {
      throw new Error('Not authorized');
    }

    // Get the feature ID
    const { data: featureData } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('name', featureId)
      .single();

    if (!featureData?.id) {
      throw new Error(`Feature ${featureId} not found in database`);
    }

    // Query metrics for the feature
    const { data, error } = await supabase
      .from('feature_metrics')
      .select('*')
      .eq('feature_id', featureData.id);

    if (error) {
      throw new Error(`Error fetching feature metrics: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getFeatureMetrics:', error);
    throw error;
  }
}

// New admin functions for feature management

/**
 * Get all feature flags
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
    console.error('Error fetching all feature flags:', error);
    throw error;
  }
}

/**
 * Create a new feature flag
 */
export async function createFeatureFlag(featureData: {
  name: string;
  description: string;
  status: boolean;
}) {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .insert(featureData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating feature flag:', error);
    throw error;
  }
}

/**
 * Update a feature flag
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

/**
 * Delete a feature flag
 */
export async function deleteFeatureFlag(featureId: string) {
  try {
    const { error } = await supabase
      .from('feature_flags')
      .delete()
      .eq('id', featureId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting feature flag:', error);
    throw error;
  }
}

/**
 * Associate feature with subscription tier
 */
export async function associateFeatureWithTier(featureId: string, tierId: string, isEnabled: boolean = true) {
  try {
    // Check if association exists
    const { data: existing } = await supabase
      .from('subscription_features')
      .select('id')
      .eq('feature_id', featureId)
      .eq('tier_id', tierId)
      .maybeSingle();
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('subscription_features')
        .update({ is_enabled: isEnabled })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('subscription_features')
        .insert({
          feature_id: featureId,
          tier_id: tierId,
          is_enabled: isEnabled
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error associating feature with tier:', error);
    throw error;
  }
}

/**
 * Get all feature segments
 */
export async function getAllFeatureSegments() {
  try {
    const { data, error } = await supabase
      .from('feature_segments')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feature segments:', error);
    throw error;
  }
}

/**
 * Create a new feature segment
 */
export async function createFeatureSegment(segmentData: {
  name: string;
  description?: string;
  criteria: Record<string, any>;
}) {
  try {
    const { data, error } = await supabase
      .from('feature_segments')
      .insert(segmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating feature segment:', error);
    throw error;
  }
}

/**
 * Map a feature to a segment
 */
export async function mapFeatureToSegment(featureId: string, segmentId: string) {
  try {
    const { data, error } = await supabase
      .from('feature_segment_mappings')
      .insert({
        feature_id: featureId,
        segment_id: segmentId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error mapping feature to segment:', error);
    throw error;
  }
}

/**
 * Remove feature from segment
 */
export async function removeFeatureFromSegment(featureId: string, segmentId: string) {
  try {
    const { error } = await supabase
      .from('feature_segment_mappings')
      .delete()
      .eq('feature_id', featureId)
      .eq('segment_id', segmentId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing feature from segment:', error);
    throw error;
  }
}

/**
 * Get all segments associated with a feature
 */
export async function getFeatureSegmentMappings(featureId: string) {
  try {
    const { data, error } = await supabase
      .from('feature_segment_mappings')
      .select(`
        id,
        feature_segments (
          id,
          name,
          description,
          criteria
        )
      `)
      .eq('feature_id', featureId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feature segment mappings:', error);
    throw error;
  }
}
