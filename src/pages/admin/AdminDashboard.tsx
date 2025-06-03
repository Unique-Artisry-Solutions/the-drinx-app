
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { Plus, Download, RefreshCw } from 'lucide-react';

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
  type AdminPageConfig,
  type AdminPageAction,
  type AdminTabConfig
} from '@/components/admin/layout';

const AdminDashboard: React.FC = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('establishments');
  const { toast } = useToast();
  const { user, isUsingDevBypass } = useDevAuthBypass();

  console.log('AdminDashboard: Auth state', { 
    user: !!user, 
    isUsingDevBypass,
    userId: user?.id 
  });

  const handleDeleteEstablishment = (id: string) => {
    setEstablishments(establishments.filter(est => est.id !== id));
    toast({
      title: 'Establishment deleted',
      description: 'The establishment has been removed from the database',
    });
  };

  const handleDeleteCocktail = (id: string) => {
    setCocktails(cocktails.filter(cocktail => cocktail.id !== id));
    toast({
      title: 'Cocktail deleted',
      description: 'The cocktail has been removed from the database',
    });
  };

  const handleRefresh = () => {
    toast({
      title: 'Data refreshed',
      description: 'All data has been updated',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your data export will be ready shortly',
    });
  };

  const handleAddNew = () => {
    toast({
      title: 'Add new item',
      description: 'This would open the creation dialog',
    });
  };

  const filteredEstablishments = establishments.filter(
    est => est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCocktails = cocktails.filter(
    cocktail => cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageConfig: AdminPageConfig = {
    title: 'Dashboard',
    description: 'Manage your establishments, cocktails, and more',
    showBreadcrumbs: true,
    maxWidth: 'xl'
  };

  const pageActions: AdminPageAction[] = [
    {
      label: 'Add New',
      icon: Plus,
      onClick: handleAddNew,
      variant: 'default'
    },
    {
      label: 'Export Data',
      icon: Download,
      onClick: handleExport,
      variant: 'outline'
    },
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: 'ghost'
    }
  ];

  const tabConfigs: AdminTabConfig[] = [
    {
      value: 'establishments',
      label: 'Establishments',
      badge: establishments.length
    },
    {
      value: 'cocktails',
      label: 'Cocktails',
      badge: cocktails.length
    },
    {
      value: 'promotions',
      label: 'Promotions'
    },
    {
      value: 'reviews',
      label: 'Reviews'
    }
  ];

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
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </div>

      <AdminTabs 
        tabs={tabConfigs}
        value={activeTab}
        onValueChange={setActiveTab}
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
