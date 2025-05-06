
import React from 'react';
import Layout from '@/components/Layout';
import UserRecipesTab from '@/components/profile/UserRecipesTab';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const UserRecipesPage = () => {
  // Add the navigation hook for consistent navigation patterns
  const navigation = useAppNavigation();

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Recipes</h1>
          <p className="text-muted-foreground">Create and manage your mocktail recipes</p>
        </div>
        
        <UserRecipesTab navigation={navigation} />
      </div>
    </Layout>
  );
};

export default UserRecipesPage;
