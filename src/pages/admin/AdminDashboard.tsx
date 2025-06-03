
import React, { useState } from 'react';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

// Imported components
import SearchToolbar from '@/components/admin/SearchToolbar';
import EstablishmentsTable from '@/components/admin/EstablishmentsTable';
import CocktailsTable from '@/components/admin/CocktailsTable';
import TabContentPlaceholder from '@/components/admin/TabContentPlaceholder';
import { 
  AdminPageLayout, 
  AdminTabs, 
  AdminTabContent,
  type AdminPageConfig
} from '@/components/admin/layout';

// New hooks
import {
  useAdminDashboard,
  useEstablishmentsData,
  useCocktailsData,
  useAdminNavigation,
  useAdminActions
} from '@/hooks/admin';

const AdminDashboard: React.FC = () => {
  const { user, isUsingDevBypass } = useDevAuthBypass();

  // Use consolidated hooks
  const { state: dashboardState, actions: dashboardActions } = useAdminDashboard('establishments');
  
  // Cast the sample data to match expected types for the components
  const establishmentData = sampleEstablishments.map(est => ({
    ...est,
    cocktailCount: est.cocktail_count || 0
  }));
  
  const cocktailData = sampleCocktails.map(cocktail => ({
    ...cocktail,
    establishment: typeof cocktail.establishment === 'string' 
      ? cocktail.establishment 
      : cocktail.establishment.name
  }));
  
  const { state: establishmentsState, actions: establishmentsActions } = useEstablishmentsData(establishmentData);
  const { state: cocktailsState, actions: cocktailsActions } = useCocktailsData(cocktailData);
  
  const navigationConfig = useAdminNavigation(
    establishmentsState.items,
    cocktailsState.items
  );

  const pageActions = useAdminActions(
    {
      showAdd: true,
      showExport: true,
      showRefresh: true
    },
    {
      onAdd: dashboardActions.handleAddNew,
      onExport: dashboardActions.handleExport,
      onRefresh: () => {
        dashboardActions.handleRefresh();
        establishmentsActions.refreshData();
        cocktailsActions.refreshData();
      }
    }
  );

  console.log('AdminDashboard: Auth state', { 
    user: !!user, 
    isUsingDevBypass,
    userId: user?.id 
  });

  const handleDeleteEstablishment = (id: string) => {
    establishmentsActions.deleteItem(id);
  };

  const handleDeleteCocktail = (id: string) => {
    cocktailsActions.deleteItem(id);
  };

  const filteredEstablishments = establishmentsActions.filterItems(dashboardState.searchTerm);
  const filteredCocktails = cocktailsActions.filterItems(dashboardState.searchTerm);

  const pageConfig: AdminPageConfig = {
    title: 'Dashboard',
    description: 'Manage your establishments, cocktails, and more',
    showBreadcrumbs: true,
    maxWidth: 'xl'
  };

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      {isUsingDevBypass && (
        <div className="mb-6 p-3 bg-orange-100 border border-orange-200 rounded-md">
          <span className="text-sm text-orange-800 font-medium">
            Dev Mode Active - Using development authentication bypass
          </span>
        </div>
      )}

      <div className="mb-6">
        <SearchToolbar 
          searchTerm={dashboardState.searchTerm} 
          onSearchChange={dashboardActions.setSearchTerm} 
        />
      </div>

      <AdminTabs 
        tabs={navigationConfig.tabs}
        value={dashboardState.activeTab}
        onValueChange={dashboardActions.setActiveTab}
      >
        <AdminTabContent value="establishments">
          <EstablishmentsTable 
            establishments={filteredEstablishments} 
            onDeleteEstablishment={handleDeleteEstablishment} 
          />
        </AdminTabContent>

        <AdminTabContent value="cocktails">
          <CocktailsTable 
            cocktails={filteredCocktails}
            onDeleteCocktail={handleDeleteCocktail}
          />
        </AdminTabContent>

        <AdminTabContent value="promotions">
          <TabContentPlaceholder
            title="Promotions Management"
            description="This section will allow you to manage promotional codes created by establishments."
          />
        </AdminTabContent>

        <AdminTabContent value="reviews">
          <TabContentPlaceholder
            title="Reviews Management"
            description="This section will allow you to manage user reviews for mocktails."
          />
        </AdminTabContent>
      </AdminTabs>
    </AdminPageLayout>
  );
};

export default AdminDashboard;
