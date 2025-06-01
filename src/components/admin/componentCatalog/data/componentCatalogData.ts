
import { PageComponentsMap } from '../types';

export const pageComponentsMap: PageComponentsMap = {
  '/admin': [
    {
      id: 'admin-dashboard',
      name: 'Admin Dashboard',
      description: 'Main admin dashboard component',
      filePath: 'src/pages/admin/AdminDashboard.tsx',
      type: 'page',
      selectors: ['.admin-dashboard', '[data-testid="admin-dashboard"]']
    }
  ],
  '/admin/rewards': [
    {
      id: 'rewards-admin',
      name: 'Rewards Admin Page',
      description: 'Rewards administration interface',
      filePath: 'src/components/admin/rewards/RewardsAdminPage.tsx',
      type: 'component',
      selectors: ['.rewards-admin', '[data-testid="rewards-admin"]']
    }
  ]
};
