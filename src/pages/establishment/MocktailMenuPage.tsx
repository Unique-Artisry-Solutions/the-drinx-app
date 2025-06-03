
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useEstablishmentProfile } from '@/hooks/establishment/useEstablishmentProfile';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';

const MocktailMenuPage: React.FC = () => {
  const { drinksState } = useEstablishmentProfile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-2xl font-bold">Mocktail Menu</h1>
          <p className="text-muted-foreground">Create and manage your mocktail offerings</p>
        </div>
        
        <MocktailMenuTab 
          drinks={drinksState.drinks} 
          onAddDrink={drinksState.handleAddDrink} 
          onUpdateDrink={drinksState.handleUpdateDrink} 
          onDeleteDrink={drinksState.handleDeleteDrink} 
        />
      </div>
    </Layout>
  );
};

export default MocktailMenuPage;
