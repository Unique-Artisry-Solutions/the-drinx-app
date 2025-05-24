
import { UserType } from '@/types/navigation';

export const MOCK_PROFILES = [
  {
    id: 'admin-001',
    username: 'admin',
    display_name: 'Admin User',
    user_type: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'est-001',
    username: 'establishment_owner',
    display_name: 'Establishment Owner',
    user_type: 'establishment',
    created_at: new Date().toISOString()
  },
  {
    id: 'promoter-001',
    username: 'event_promoter',
    display_name: 'Event Promoter',
    user_type: 'promoter',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-001',
    username: 'regular_user',
    display_name: 'Regular User',
    user_type: 'individual',
    created_at: new Date().toISOString()
  }
];

export const MOCK_USERS: Record<UserType, any> = {
  admin: {
    id: 'admin-001',
    email: 'admin@spiritless.co',
    user_metadata: {
      display_name: 'Admin User',
      user_type: 'admin'
    },
    created_at: new Date().toISOString()
  },
  establishment: {
    id: 'est-001',
    email: 'establishment@example.com',
    user_metadata: {
      display_name: 'Establishment Owner',
      user_type: 'establishment'
    },
    created_at: new Date().toISOString()
  },
  promoter: {
    id: 'promoter-001',
    email: 'promoter@example.com',
    user_metadata: {
      display_name: 'Event Promoter',
      user_type: 'promoter'
    },
    created_at: new Date().toISOString()
  },
  individual: {
    id: 'user-001',
    email: 'user@example.com',
    user_metadata: {
      display_name: 'Regular User',
      user_type: 'individual'
    },
    created_at: new Date().toISOString()
  }
};
