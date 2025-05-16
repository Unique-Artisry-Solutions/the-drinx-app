
import { FeatureItem } from '../../types';

export const swigCircuitsFeature: FeatureItem = {
  id: 'swig-circuits',
  name: 'Swig Circuits',
  description: 'Pre-planned routes for visiting multiple establishments',
  status: 'in_progress',
  implementationProgress: 55,
  priority: 'high',
  complexity: 'high',
  category: 'Bar Crawl',
  tags: ['bar-crawl', 'route', 'circuit'],
  dependencies: ['map-integration', 'establishment-database'],
  dbStatus: 'partial',
  dbRequirementsText: 'Tables for circuits, route data, and participation records'
};
