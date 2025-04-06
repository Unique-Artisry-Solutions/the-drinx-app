
import React from 'react';
import Layout from '@/components/Layout';
import UserRecipesTab from '@/components/profile/UserRecipesTab';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const UserRecipesPage = () => {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Recipes</h1>
          <p className="text-muted-foreground">Create and manage your mocktail recipes</p>
        </div>
        
        <Alert className="mb-6 border-spiritless-pink/20 bg-spiritless-pink/5">
          <InfoIcon className="h-4 w-4 text-spiritless-pink" />
          <AlertTitle>Recipes are stored locally</AlertTitle>
          <AlertDescription>
            Currently, recipes are stored in your browser's local storage. 
            In the future, they'll be saved to your account.
          </AlertDescription>
        </Alert>
        
        <UserRecipesTab />
      </div>
    </Layout>
  );
};

export default UserRecipesPage;
