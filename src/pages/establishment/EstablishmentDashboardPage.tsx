
import React from 'react';
import { Layout } from '@/components/Layout';
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard';
import { useAuth } from '@/contexts/auth';

const EstablishmentDashboardPage = () => {
  const { user } = useAuth();
  const establishmentName = localStorage.getItem('establishment_name') || 'Your Establishment';
  const establishmentId = user?.id || '';

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
