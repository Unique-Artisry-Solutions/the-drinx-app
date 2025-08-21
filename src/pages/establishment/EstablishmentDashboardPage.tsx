
import React from 'react';
import Layout from '@/components/Layout';
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard';
import { useUserEstablishment } from '@/hooks/establishment/useUserEstablishment';

const EstablishmentDashboardPage = () => {
  const { establishmentId: userEstablishmentId, isLoading } = useUserEstablishment();
  
  // Use establishment data
  const establishmentName = localStorage.getItem('establishment_name') || 'Your Establishment';
  const establishmentId = userEstablishmentId || '';

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading establishment data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <EstablishmentDashboard 
        establishmentName={establishmentName}
        establishmentId={establishmentId}
      />
    </Layout>
  );
};

export default EstablishmentDashboardPage;
