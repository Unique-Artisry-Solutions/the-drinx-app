
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { useComponentCatalog } from '@/components/admin/componentCatalog/hooks/useComponentCatalog';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import { ComponentCatalogItem } from '@/components/admin/componentCatalog/types';
import ComponentDetails from '@/components/admin/componentCatalog/ComponentDetails';
import ComponentGroupSection from '@/components/admin/componentCatalog/ComponentGroupSection';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const ComponentCatalogPage: React.FC = () => {
  const { componentsByPage, isLoading, searchComponents } = useComponentCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentCatalogItem | null>(null);
  const [activePageKey, setActivePageKey] = useState<string>('all');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchComponents(query);
  };
  
  return (
    <AnalyticsService pageView="component_catalog">
      <Layout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Component Catalog</h1>
              <p className="text-gray-500 mt-1">
                Browse and search components from across the application
              </p>
            </div>
          </div>
          
          {/* Search bar moved to the top */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search components by name, type, or file path..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {/* Floating page selector menu */}
          <div className="mb-4 flex items-center">
            <div className="text-sm text-gray-500 mr-2">Viewing:</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  {activePageKey === 'all' 
                    ? 'All Pages' 
                    : componentsByPage[activePageKey]?.pageName || 'Select Page'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem 
                  className={activePageKey === 'all' ? 'bg-gray-100' : ''} 
                  onClick={() => setActivePageKey('all')}
                >
                  All Pages
                </DropdownMenuItem>
                {Object.keys(componentsByPage).map((pagePath) => (
                  <DropdownMenuItem 
                    key={pagePath} 
                    className={activePageKey === pagePath ? 'bg-gray-100' : ''}
                    onClick={() => setActivePageKey(pagePath)}
                  >
                    {componentsByPage[pagePath].pageName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area (left side) */}
            <div className="w-full lg:w-2/3">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-lg text-gray-500">Loading components...</div>
                </div>
              ) : (
                <div>
                  {activePageKey === 'all' ? (
                    // Display all pages when "All Pages" is selected
                    Object.keys(componentsByPage).map((pagePath) => (
                      <div key={pagePath} className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">{componentsByPage[pagePath].pageName}</h2>
                        <p className="text-gray-500 mb-6">{componentsByPage[pagePath].description}</p>
                        {componentsByPage[pagePath].components.map((group) => (
                          <ComponentGroupSection 
                            key={group.name} 
                            group={group} 
                            onSelectComponent={setSelectedComponent} 
                          />
                        ))}
                      </div>
                    ))
                  ) : (
                    // Display only the selected page
                    componentsByPage[activePageKey] && (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">{componentsByPage[activePageKey].pageName}</h2>
                        <p className="text-gray-500 mb-6">{componentsByPage[activePageKey].description}</p>
                        {componentsByPage[activePageKey].components.map((group) => (
                          <ComponentGroupSection 
                            key={group.name} 
                            group={group} 
                            onSelectComponent={setSelectedComponent} 
                          />
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            
            {/* Component details sidebar (right side) */}
            <div className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-4">
                <ComponentDetails component={selectedComponent} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AnalyticsService>
  );
};

export default ComponentCatalogPage;
