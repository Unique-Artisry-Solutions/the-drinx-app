import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import DevBypass from '@/components/development/DevBypass';

const StreamlinedAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex gap-6">
          <main className="flex-1">
            <Outlet />
          </main>
          <aside className="w-80 space-y-4">
            <DevBypass variant="compact" />
          </aside>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default StreamlinedAdminLayout;