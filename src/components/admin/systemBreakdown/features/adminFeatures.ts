
import { FeatureItem } from '../types';
import { userManagement } from './adminFeatures/userManagement';
import { establishmentManagement } from './adminFeatures/establishmentManagement';
import { barCrawlManagement } from './adminFeatures/barCrawlManagement';
import { contentManagement } from './adminFeatures/contentManagement';
import { systemConfiguration } from './adminFeatures/systemConfiguration';
import { analyticsDashboard } from './adminFeatures/analyticsDashboard';
import { photoModeration } from './adminFeatures/photoModeration';
import { systemBreakdown } from './adminFeatures/systemBreakdown';
import { contentModeration } from './adminFeatures/contentModeration';
import { pushNotificationSystem } from './adminFeatures/pushNotificationSystem';

export const adminFeatures: FeatureItem[] = [
  userManagement,
  establishmentManagement,
  barCrawlManagement,
  contentManagement,
  systemConfiguration,
  analyticsDashboard,
  photoModeration,
  systemBreakdown,
  contentModeration,
  pushNotificationSystem
];
