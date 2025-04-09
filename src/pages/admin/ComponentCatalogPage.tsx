
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useComponentCatalog } from '@/components/admin/componentCatalog/hooks/useComponentCatalog';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import { ComponentCatalogItem } from '@/components/admin/componentCatalog/types';
import ComponentDetails from '@/components/admin/componentCatalog/ComponentDetails';
import ComponentGroupSection from '@/components/admin/componentCatalog/ComponentGroupSection';

const ComponentCatalogPage: React.FC = () => {
  const { componentsByPage, isLoading, searchComponents } = useComponentCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentCatalogItem | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
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
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
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
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-lg text-gray-500">Loading components...</div>
                </div>
              ) : (
                <div className="relative z-10"> {/* Added z-index to ensure tab navigation stays above details panel */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="mb-2">
                      <TabsTrigger value="all">All Pages</TabsTrigger>
                      {Object.keys(componentsByPage).map((pagePath) => (
                        <TabsTrigger key={pagePath} value={pagePath}>
                          {componentsByPage[pagePath].pageName}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {Object.keys(componentsByPage).map((pagePath) => (
                      <TabsContent key={pagePath} value={pagePath} className="pt-4">
                        <h2 className="text-2xl font-bold mb-4">{componentsByPage[pagePath].pageName}</h2>
                        <p className="text-gray-500 mb-6">{componentsByPage[pagePath].description}</p>
                        {componentsByPage[pagePath].components.map((group) => (
                          <ComponentGroupSection 
                            key={group.name} 
                            group={group} 
                            onSelectComponent={setSelectedComponent} 
                          />
                        ))}
                      </TabsContent>
                    ))}
                    
                    <TabsContent value="all" className="pt-4">
                      {Object.keys(componentsByPage).map((pagePath) => (
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
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-1/3">
              <div className="lg:sticky lg:top-4"> {/* Added sticky positioning within container */}
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
