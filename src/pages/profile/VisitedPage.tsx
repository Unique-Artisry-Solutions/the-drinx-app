
import React from 'react';
import { Layout } from '@/components/Layout';
import VisitedTab from '@/components/profile/VisitedTab';
import BackButton from '@/components/navigation/BackButton';

const VisitedPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <BackButton className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Visited Places</h1>
              <p className="text-material-on-surface-variant">
                View your visit history and achievements
              </p>
            </div>
          </div>
        </div>
        
        <VisitedTab />
      </div>
    </Layout>
  );
};

export default VisitedPage;
