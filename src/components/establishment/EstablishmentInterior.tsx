
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

import EstablishmentHeader from './EstablishmentHeader';
import MenuTabContent from './tabs/MenuTabContent';
import InfoTabContent from './tabs/InfoTabContent';
import TopRatedTabContent from './tabs/TopRatedTabContent';
import LocationCard from './sidebar/LocationCard';
import BarCrawlCard from './sidebar/BarCrawlCard';
import BarCrawlRequestModal from './BarCrawlRequestModal';
import { useEstablishmentInterior } from './useEstablishmentInterior';

interface EstablishmentInteriorProps {
  establishment: any;
  cocktails: any[];
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

const EstablishmentInterior: React.FC<EstablishmentInteriorProps> = ({
  establishment,
  cocktails
}) => {
  const { 
    isBarCrawlModalOpen, 
    setIsBarCrawlModalOpen, 
    activeUsers, 
    hasCheckedIn, 
    isPromoter,
    getSortedTopCocktails, 
    handleCheckIn, 
    handleBarCrawlRequest,
    formatBusinessHours
  } = useEstablishmentInterior(establishment);

  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  
  // Get top rated cocktails for the tab
  const topRatedCocktails = getSortedTopCocktails(cocktails);
  
  // Format business hours for display
  const businessHoursDisplay = formatBusinessHours();
  
  return (
    <div className={cn(
      "animate-fade-in vibrant-bg rounded-xl p-4",
      isLightTheme ? "bg-[#f5f3ed]/80" : ""
    )}>
      <EstablishmentHeader 
        establishment={establishment}
        hasCheckedIn={hasCheckedIn}
        isPromoter={isPromoter}
        onCheckIn={handleCheckIn}
        onBarCrawlRequest={handleBarCrawlRequest}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="menu">
            <TabsList className={cn(
              "w-full mb-4 p-1 rounded-xl",
              isLightTheme 
                ? "bg-[#f5f3ed] border border-gray-200" 
                : "bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10"
            )}>
              <TabsTrigger value="menu" className="vibrant-tab">Mocktail Menu</TabsTrigger>
              <TabsTrigger value="info" className="vibrant-tab">Information</TabsTrigger>
              <TabsTrigger value="top-rated" className="vibrant-tab">Top Rated</TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu">
              <MenuTabContent cocktails={cocktails} />
            </TabsContent>
            
            <TabsContent value="info">
              <InfoTabContent 
                establishment={establishment}
                activeUsers={activeUsers}
                businessHoursDisplay={businessHoursDisplay.map(hour => ({
                  days: hour.day,
                  hours: hour.hours
                }))}
                isLightTheme={isLightTheme}
              />
            </TabsContent>
            
            <TabsContent value="top-rated">
              <TopRatedTabContent 
                topRatedCocktails={topRatedCocktails} 
                isLightTheme={isLightTheme}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <LocationCard 
            establishment={establishment}
          />
          
          {/* Only show the Bar Crawl Information card for promoters */}
          {isPromoter && (
            <BarCrawlCard 
              establishment={establishment}
              onBarCrawlRequest={handleBarCrawlRequest}
              isLightTheme={isLightTheme}
            />
          )}
        </div>
      </div>
      
      <BarCrawlRequestModal 
        isOpen={isBarCrawlModalOpen} 
        onClose={() => setIsBarCrawlModalOpen(false)} 
        establishment={establishment} 
      />
    </div>
  );
};

export default EstablishmentInterior;
