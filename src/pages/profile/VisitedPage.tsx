
import React from 'react';
import Layout from '@/components/Layout';
import VisitedTab from '@/components/profile/VisitedTab';
import { Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';
import BackButton from '@/components/navigation/BackButton';

const VisitedPage: React.FC = () => {
  const visitedEstablishments: Establishment[] = sampleEstablishments.slice(2, 5);

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <BackButton className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Visited Places</h1>
              <p className="text-material-on-surface-variant">
                Establishments you've visited
              </p>
            </div>
          </div>
        </div>
        
        <VisitedTab visitedEstablishments={visitedEstablishments} />
      </div>
    </Layout>
  );
};

export default VisitedPage;
