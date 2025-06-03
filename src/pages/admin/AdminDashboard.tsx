
import React from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { AdminTabsContainer } from '@/components/admin/layout';
import { AdminTabs } from '@/components/admin/layout';
import { TabsContent } from '@/components/ui/tabs';
import { useData, useAuth } from '@/hooks/core';
import { useAdminNavigation } from '@/hooks/admin/useAdminNavigation';
import { DASHBOARD_TAB_CONFIG } from '@/config/admin/tabConfigurations';
import { updateTabBadges } from '@/utils/admin/tabConfigUtils';

// Mock data for establishments
const mockEstablishments = [
  { id: '1', name: 'The Tipsy Tavern', cocktailCount: 12 },
  { id: '2', name: 'Sunset Lounge', cocktailCount: 8 },
  { id: '3', name: 'The Beer Garden', cocktailCount: 15 },
];

// Mock data for cocktails
const mockCocktails = [
  { id: '101', name: 'Mojito', establishment: 'The Tipsy Tavern' },
  { id: '102', name: 'Cosmopolitan', establishment: 'Sunset Lounge' },
  { id: '103', name: 'Old Fashioned', establishment: 'The Beer Garden' },
];

const mockFetchEstablishments = async () => mockEstablishments;
const mockFetchCocktails = async () => mockCocktails;

const EstablishmentsTab: React.FC<{
  establishments: any[];
  onDelete: (id: string) => void;
}> = ({ establishments, onDelete }) => (
  <div>
    <h3>Establishments</h3>
    <ul>
      {establishments.map((e) => (
        <li key={e.id}>
          {e.name} - {e.cocktailCount} cocktails
          <button onClick={() => onDelete(e.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

const CocktailsTab: React.FC<{
  cocktails: any[];
  onDelete: (id: string) => void;
}> = ({ cocktails, onDelete }) => (
  <div>
    <h3>Cocktails</h3>
    <ul>
      {cocktails.map((c) => (
        <li key={c.id}>
          {c.name} - {c.establishment}
          <button onClick={() => onDelete(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

const PromotionsTab: React.FC = () => (
  <div>
    <h3>Promotions</h3>
    <p>List of promotions...</p>
  </div>
);

const ReviewsTab: React.FC = () => (
  <div>
    <h3>Reviews</h3>
    <p>Customer reviews and ratings...</p>
  </div>
);

interface AdminDashboardProps {
  useNewTabSystem?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  useNewTabSystem = false 
}) => {
  const { state: authState } = useAuth();
  const { state: establishmentsState, actions: establishmentsActions } = useData({
    initialData: mockEstablishments,
    fetchFn: mockFetchEstablishments,
    itemType: 'establishment'
  });
  const { state: cocktailsState, actions: cocktailsActions } = useData({
    initialData: mockCocktails,
    fetchFn: mockFetchCocktails,
    itemType: 'cocktail'
  });
  
  const navigationConfig = useAdminNavigation(
    establishmentsState.data,
    cocktailsState.data,
    [],
    useNewTabSystem
  );

  const pageConfig = {
    title: 'Admin Dashboard',
    description: 'Manage establishments, cocktails, and platform content',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Refresh Data',
      onClick: () => {
        establishmentsActions.refetch();
        cocktailsActions.refetch();
      }
    }
  ];

  if (useNewTabSystem && navigationConfig.configuration) {
    const configWithBadges = updateTabBadges(navigationConfig.configuration, {
      establishments: establishmentsState.data.length,
      cocktails: cocktailsState.data.length
    });

    return (
      <AdminPageLayout
        config={pageConfig}
        actions={pageActions}
        isLoading={establishmentsState.isLoading || cocktailsState.isLoading}
        error={establishmentsState.error || cocktailsState.error}
      >
        <AdminTabsContainer configuration={configWithBadges}>
          <TabsContent value="establishments">
            <EstablishmentsTab
              establishments={establishmentsState.data}
              onDelete={establishmentsActions.deleteItem}
            />
          </TabsContent>
          <TabsContent value="cocktails">
            <CocktailsTab
              cocktails={cocktailsState.data}
              onDelete={cocktailsActions.deleteItem}
            />
          </TabsContent>
          <TabsContent value="promotions">
            <PromotionsTab />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>
        </AdminTabsContainer>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      config={pageConfig}
      actions={pageActions}
      isLoading={establishmentsState.isLoading || cocktailsState.isLoading}
      error={establishmentsState.error || cocktailsState.error}
    >
      <AdminTabs
        tabs={navigationConfig.tabs}
        defaultValue={navigationConfig.defaultTab}
      >
        <TabsContent value="establishments">
          <EstablishmentsTab
            establishments={establishmentsState.data}
            onDelete={establishmentsActions.deleteItem}
          />
        </TabsContent>
        <TabsContent value="cocktails">
          <CocktailsTab
            cocktails={cocktailsState.data}
            onDelete={cocktailsActions.deleteItem}
          />
        </TabsContent>
        <TabsContent value="promotions">
          <PromotionsTab />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
      </AdminTabs>
    </AdminPageLayout>
  );
};

export default AdminDashboard;
