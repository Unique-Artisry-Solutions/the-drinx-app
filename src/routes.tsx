
import React from 'react';
import { RouteObject } from 'react-router-dom';
import AudienceManagement from './routes/admin/AudienceManagement';

// Define only the routes we need for now
// We'll let the AppRoutes.tsx handle the main routing
const routes: RouteObject[] = [
  {
    path: "/admin/audience",
    element: <AudienceManagement />,
  },
];

export default routes;
