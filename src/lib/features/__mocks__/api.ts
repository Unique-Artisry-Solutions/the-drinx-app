
import { FeatureId } from '../registry';

// Mock feature access API for testing
export async function checkFeatureAccess(featureId: FeatureId): Promise<boolean> {
  // In tests, grant access to all features except those explicitly denied
  const deniedFeatures: FeatureId[] = ['priority_registration'];
  return !deniedFeatures.includes(featureId);
}

export async function trackFeatureEvent(
  featureId: FeatureId, 
  eventType: string = 'use', 
  data: Record<string, any> = {}
): Promise<void> {
  // Mock implementation that does nothing in tests
}

export async function batchCheckFeatureAccess(
  featureIds: FeatureId[]
): Promise<Record<FeatureId, boolean>> {
  const result: Record<FeatureId, boolean> = {} as Record<FeatureId, boolean>;
  const deniedFeatures: FeatureId[] = ['priority_registration'];
  
  for (const featureId of featureIds) {
    result[featureId] = !deniedFeatures.includes(featureId);
  }
  
  return Promise.resolve(result);
}
