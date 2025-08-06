
import React, { Suspense } from 'react';
import Layout from '@/components/Layout';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SimplifiedSystemConfiguration from '@/components/admin/systemConfiguration/SimplifiedSystemConfiguration';

const SystemConfigurationPage = () => {
  return (
    <Layout>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p className="text-muted-foreground">Loading system configuration...</p>
            </div>
          </div>
        }
      >
        <SimplifiedSystemConfiguration />
      </Suspense>
    </Layout>
  );
};

export default SystemConfigurationPage;
