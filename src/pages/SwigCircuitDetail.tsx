
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/core';
import SwigCircuitDetails from '@/components/swigCircuit/SwigCircuitDetails';

const SwigCircuitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const { userType } = state;

  // Mock bar crawl data - replace with actual data fetching
  const swigCircuit = {
    id: id || '1',
    name: 'Downtown Mocktail Tour',
    organizer: 'Sarah Johnson',
    date: '2024-02-15',
    stops: 5,
    description: 'Explore the best non-alcoholic cocktails in downtown!'
  };

  const isAdminOrPromoter = userType === 'admin' || userType === 'promoter';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{swigCircuit.name}</h1>
          
          <SwigCircuitDetails
            organizer={swigCircuit.organizer}
            date={swigCircuit.date}
            stops={swigCircuit.stops}
          />
          
          <div className="mt-6">
            <p className="text-gray-700">{swigCircuit.description}</p>
          </div>

          {isAdminOrPromoter && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Admin/Promoter Controls</h3>
              <p className="text-sm text-gray-600">
                You have administrative privileges for this bar crawl.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SwigCircuitDetail;
