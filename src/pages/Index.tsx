
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const userType = localStorage.getItem('user_type');
  const isEstablishment = userType === 'establishment';
  const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
    // Make sure we're not in a loading state
    if (isLoading) return;
    
    // If user is not authenticated, redirect to landing
    if (!user) {
      navigate('/landing', { replace: true });
      return;
    }
    
    // If admin is authenticated, redirect to system breakdown page
    if (isAdmin) {
      navigate('/admin/system-breakdown', { replace: true });
      return;
    }
    
    // If user is authenticated and is an individual, redirect to explore
    if (user && !isEstablishment) {
      navigate('/explore', { replace: true });
      return;
    }
    
    // If user is authenticated and is an establishment, the dashboard will be shown
  }, [user, isLoading, navigate, isEstablishment, isAdmin]);

  // If we're still loading, show a loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </Layout>
    );
  }

  // If user is authenticated and is an establishment, show the dashboard
  if (user && isEstablishment) {
    return (
      <Layout>
        <EstablishmentDashboard 
          establishmentName={localStorage.getItem('user_username') || 'Your Establishment'} 
          establishmentId={user.id} 
        />
      </Layout>
    );
  }

  // This should rarely be seen because of the redirects in useEffect
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        Redirecting...
      </div>
    </Layout>
  );
};

export default Index;
