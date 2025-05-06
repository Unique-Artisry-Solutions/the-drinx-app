
import { userProfiles } from './userProfiles';
import { adminDashboard } from './adminDashboard';
import { userAuth } from './userAuth';
import { rewardSystem } from './rewardSystem';
import { contentManagement } from './contentManagement';
import { analyticsDashboard } from './analyticsDashboard';
import { pushNotificationSystem } from './pushNotificationSystem';
import { audienceSegmentation } from './audienceSegmentation';

export const adminFeatures = [
  userAuth,
  userProfiles,
  adminDashboard,
  rewardSystem,
  contentManagement,
  analyticsDashboard,
  pushNotificationSystem,
  audienceSegmentation
];
