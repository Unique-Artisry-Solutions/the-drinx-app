import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const Index: React.FC = () => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';

  // If authenticated, redirect to the explore page
  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  // If not authenticated, redirect to the landing page
  return <Navigate to="/landing" replace />;
};

export default Index;
