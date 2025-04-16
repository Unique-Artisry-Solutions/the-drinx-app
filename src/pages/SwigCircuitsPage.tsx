import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import SwigCircuitsHeader from '@/components/swigCircuit/SwigCircuitsHeader';
import SwigCircuitFilters from '@/components/swigCircuit/SwigCircuitFilters';
import SwigCircuitsList from '@/components/swigCircuit/SwigCircuitsList';
import useSwigCircuitsData from '@/hooks/swigCircuit/useSwigCircuitsData';
import useSwigCircuitsTheme from '@/hooks/swigCircuit/useSwigCircuitsTheme';

const SwigCircuitsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    filteredCircuits,
    searchTerm,
    isLoading,
    handleSearch,
    filterByCategory
  } = useSwigCircuitsData();

  const {
    getThemeColor,
    getThemeBorderColor,
    getThemeImage,
    getDifficultyColor,
    getDifficultyIcon
  } = useSwigCircuitsTheme();

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        <div className="mb-6">
          <SwigCircuitsHeader user={user} />
          <SwigCircuitFilters searchTerm={searchTerm} handleSearch={handleSearch} />
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-800/80 p-1 backdrop-blur-sm">
            <TabsTrigger 
              value="all" 
              onClick={() => filterByCategory('all')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              All Circuits
            </TabsTrigger>
            <TabsTrigger 
              value="urban" 
              onClick={() => filterByCategory('Urban Exploration')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Urban Exploration
            </TabsTrigger>
            <TabsTrigger 
              value="weekend" 
              onClick={() => filterByCategory('Weekend Getaway')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Weekend
            </TabsTrigger>
            <TabsTrigger 
              value="cocktail" 
              onClick={() => filterByCategory('Cocktail Masters')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Cocktail Masters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <SwigCircuitsList 
              circuits={filteredCircuits}
              isLoading={isLoading}
              getThemeColor={getThemeColor}
              getThemeBorderColor={getThemeBorderColor}
              getThemeImage={getThemeImage}
              getDifficultyColor={getDifficultyColor}
              getDifficultyIcon={getDifficultyIcon}
            />
          </TabsContent>
          
          {/* Other tab contents will show the same content through the filter function */}
          <TabsContent value="urban" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
          <TabsContent value="weekend" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
          <TabsContent value="cocktail" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitsPage;
