
import { FeatureItem } from '../../types';

export const mapIntegrationFeature: FeatureItem = {
  id: 'map-integration',
  name: 'Map Integration',
  description: 'Interactive map showing nearby establishments and events',
  status: 'implemented',
  implementationProgress: 85,
  priority: 'high',
  complexity: 'medium',
  category: 'Maps',
  tags: ['map', 'location', 'navigation'],
  dependencies: ['establishment-database', 'geolocation'],
  dbStatus: 'complete',
  dbRequirementsText: 'Tables for geolocation data and map preferences'
};
