
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Use useEffect to handle navigation properly
  useEffect(() => {
    // Make sure we're not in a loading state
    if (isLoading) return;
    
    // Read authentication info
    const userType = localStorage.getItem('user_type');
    const isEstablishment = userType === 'establishment';
    const isPromoter = userType === 'promoter';
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    
    // For debugging
    console.log("Index page navigation check:", { 
      user, isLoading, userType, isEstablishment, isPromoter, isAdmin 
    });
    
    // If admin is authenticated, redirect to system breakdown page
    if (isAdmin) {
      navigate('/admin/system-breakdown', { replace: true });
      return;
    }
    
    // If user is authenticated and is an establishment, redirect to establishment dashboard
    if (user && isEstablishment) {
      navigate('/establishment/dashboard', { replace: true });
      return;
    }
    
    // If user is authenticated and is a promoter, redirect to promoter dashboard/page
    if (user && isPromoter) {
      navigate('/promotions', { replace: true });
      return;
    }
    
    // If user is authenticated and is an individual, redirect to explore
    if (user && !isEstablishment && !isPromoter) {
      navigate('/explore', { replace: true });
      return;
    }
    
    // If user is not authenticated, redirect to landing
    if (!user) {
      navigate('/landing', { replace: true });
      return;
    }
  }, [user, isLoading, navigate]);

  // If we're still loading, show a loading state
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    </Layout>
  );
};

export default Index;
