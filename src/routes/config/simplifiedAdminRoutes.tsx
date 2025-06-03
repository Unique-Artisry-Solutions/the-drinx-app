
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Simplified lazy loaded components
const SimplifiedAdminUsersPage = lazy(() => import('@/pages/admin/SimplifiedAdminUsersPage'));
const SimplifiedAdminEstablishmentsPage = lazy(() => import('@/pages/admin/SimplifiedAdminEstablishmentsPage'));

export const simplifiedAdminRoutes: RouteObject[] = [
  {
    path: '/admin/simplified',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['admin']}
        redirectTo="/admin/login"
      >
        <AdminLayout />
      </RouteProtectionWrapper>
    ),
    children: [
      { 
        path: 'users', 
        element: <SimplifiedAdminUsersPage />
      },
      { 
        path: 'establishments', 
        element: <SimplifiedAdminEstablishmentsPage />
      },
    ]
  },
];
