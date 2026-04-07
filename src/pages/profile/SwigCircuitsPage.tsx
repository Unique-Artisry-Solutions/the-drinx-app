import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import SwigCircuitTab from '@/components/profile/SwigCircuitTab';
import { Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';
const SwigCircuitsPage: React.FC = () => {
  const [swigCircuitList, setSwigCircuitList] = useState<Establishment[]>(sampleEstablishments.slice(0, 3));
  const {
    toast
  } = useToast();
  const shareSwigCircuit = () => {
    toast({
      title: 'Swig Circuit Shared',
      description: 'Your Swig Circuit list has been shared with users in your area!'
    });
  };
  return <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background text-rose-300">Joined Swig Circuits</h1>
              <p className="text-material-on-surface-variant">
                View Swig Circuits you've joined or participated in
              </p>
            </div>
          </div>
        </div>
        
        <SwigCircuitTab swigCircuitList={swigCircuitList} shareSwigCircuit={shareSwigCircuit} />
      </div>
    </Layout>;
};
export default SwigCircuitsPage;