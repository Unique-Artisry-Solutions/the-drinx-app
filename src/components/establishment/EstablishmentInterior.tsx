import React, { useState } from 'react';
import { MapPin, Phone, Star, Users, Calendar, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import CocktailCard from '@/components/CocktailCard';
import BarCrawlRequestModal from './BarCrawlRequestModal';
import MapView from '@/components/map/MapView';
import { useTheme } from '@/contexts/ThemeContext';
import { BusinessHour } from './BusinessHoursEditor';

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
  cocktails,
  userLocation
}) => {
  const [isBarCrawlModalOpen, setIsBarCrawlModalOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(establishment.activeUsers || Math.floor(Math.random() * 11));
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';

  // Sort cocktails by rating for top-rated display
  const topRatedCocktails = [...cocktails].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  
  const handleCheckIn = () => {
    if (!localStorage.getItem('user_authenticated')) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to check in at this establishment',
        variant: 'destructive'
      });
      return;
    }
    setHasCheckedIn(true);
    setActiveUsers(prev => prev + 1);
    toast({
      title: 'Checked In!',
      description: `You've checked in at ${establishment.name}`
    });
  };
  
  const handleBarCrawlRequest = () => {
    setIsBarCrawlModalOpen(true);
  };

  // Map data for this single establishment
  const mapEstablishments = [{
    id: establishment.id,
    name: establishment.name,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
    cocktailCount: establishment.cocktailCount
  }];

  // Handle business hours display
  const formatBusinessHours = () => {
    // First check if we have structured business hours
    if (establishment.businessHours && Array.isArray(establishment.businessHours)) {
      const hours = establishment.businessHours as BusinessHour[];
      
      // Group days with the same hours
      const groupedHours: Record<string, string[]> = {};
      
      hours.forEach(hour => {
        const timeString = `${hour.openTime} - ${hour.closeTime}`;
        if (!groupedHours[timeString]) {
          groupedHours[timeString] = [];
        }
        groupedHours[timeString].push(hour.day);
      });
      
      // Format grouped hours for display
      return Object.entries(groupedHours).map(([hours, days]) => {
        // If there are consecutive days with the same hours, group them
        if (days.length > 1) {
          return { 
            days: `${days[0]} - ${days[days.length - 1]}`, 
            hours 
          };
        }
        return { days: days[0], hours };
      });
    }
    
    // Fallback to default display if no structured hours
    return [
      { days: 'Monday - Thursday', hours: '11:00 AM - 10:00 PM' },
      { days: 'Friday - Saturday', hours: '11:00 AM - 12:00 AM' },
      { days: 'Sunday', hours: '12:00 PM - 9:00 PM' }
    ];
  };
  
  const businessHoursDisplay = formatBusinessHours();
  
  return (
    <div className={cn(
      "animate-fade-in vibrant-bg rounded-xl p-4",
      isLightTheme ? "bg-[#f5f3ed]/80" : ""
    )}>
      <div className="h-48 md:h-64 bg-material-primary/10 rounded-xl mb-6 bg-cover bg-center relative glow-hover" 
        style={{
          backgroundImage: `url(${establishment.image || '/placeholder.svg'})`
        }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-between items-end">
            <div>
              <Badge variant="secondary" className="mb-2 bg-gradient-to-r from-spiritless-green to-spiritless-green-light text-white">
                {establishment.cocktailCount} Mocktails
              </Badge>
              <h1 className="text-3xl font-bold text-white">{establishment.name}</h1>
              <div className="flex items-center mt-1 text-white/90">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{establishment.address}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {!hasCheckedIn && (
                <Button size="sm" onClick={handleCheckIn} variant="gradient" className="shadow-md hover:shadow-lg">
                  Check In
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleBarCrawlRequest} 
                className="border-white text-white bg-black/50 backdrop-blur-sm hover:bg-black/60"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add to Bar Crawl
              </Button>
            </div>
          </div>
        </div>
      </div>

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
              <div className="space-y-4">
                {cocktails.length > 0 ? cocktails.map(cocktail => (
                  <CocktailCard 
                    key={cocktail.id} 
                    id={cocktail.id} 
                    name={cocktail.name} 
                    price={cocktail.price} 
                    description={cocktail.description} 
                    ingredients={cocktail.ingredients} 
                    image={cocktail.image} 
                    establishment={cocktail.establishment} 
                  />
                )) : (
                  <Alert>
                    <AlertDescription>
                      No mocktails available at this time.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="info">
              <Card className="vibrant-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center accent-border-left">
                      <MapPin className="h-5 w-5 mr-2 text-spiritless-pink" />
                      <span className={isLightTheme ? "text-gray-700" : ""}>
                        {establishment.address}
                      </span>
                    </div>
                    <div className="flex items-center accent-border-left border-spiritless-green">
                      <Phone className="h-5 w-5 mr-2 text-spiritless-green" />
                      <span className={isLightTheme ? "text-gray-700" : ""}>
                        {establishment.phone || '555-123-4567'}
                      </span>
                    </div>
                    <div className="flex items-center accent-border-left border-spiritless-orange">
                      <Users className="h-5 w-5 mr-2 text-spiritless-orange" />
                      <span className={isLightTheme ? "text-gray-700" : ""}>
                        {activeUsers} {activeUsers === 1 ? 'person' : 'people'} here now
                      </span>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className={cn(
                        "font-medium mb-2 text-lg",
                        isLightTheme ? "text-gray-800" : "gradient-text"
                      )}>
                        Business Hours
                      </h3>
                      <div className={cn(
                        "grid grid-cols-2 gap-2 text-sm",
                        isLightTheme ? "text-gray-700" : ""
                      )}>
                        {businessHoursDisplay.map((hours, index) => (
                          <React.Fragment key={index}>
                            <div>{hours.days}</div>
                            <div>{hours.hours}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className={cn(
                        "font-medium mb-2 text-lg",
                        isLightTheme ? "text-gray-800" : "gradient-text"
                      )}>
                        About
                      </h3>
                      <p className={cn(
                        "text-sm",
                        isLightTheme ? "text-gray-600" : "text-material-on-surface-variant"
                      )}>
                        {establishment.description || `${establishment.name} is a premier destination for non-alcoholic cocktails. 
                          We pride ourselves on creating innovative and delicious mocktails that everyone can enjoy.`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="top-rated">
              <div className="space-y-4">
                {topRatedCocktails.length > 0 ? (
                  <>
                    <h3 className={cn(
                      "text-lg font-medium mb-3",
                      isLightTheme ? "text-gray-800" : "vibrant-header"
                    )}>
                      Most Popular Mocktails
                    </h3>
                    {topRatedCocktails.map((cocktail, index) => (
                      <div key={cocktail.id} className="relative">
                        {index === 0 && (
                          <div className="absolute -top-2 -left-2 z-10">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md">Top Pick</Badge>
                          </div>
                        )}
                        <CocktailCard 
                          id={cocktail.id} 
                          name={cocktail.name} 
                          price={cocktail.price} 
                          description={cocktail.description} 
                          ingredients={cocktail.ingredients} 
                          image={cocktail.image} 
                          establishment={cocktail.establishment} 
                        />
                      </div>
                    ))}
                  </> 
                ) : (
                  <Alert>
                    <AlertDescription>
                      No ratings available yet.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card className="vibrant-card">
            <CardHeader>
              <CardTitle className={cn(
                "text-lg",
                isLightTheme ? "text-gray-800" : "gradient-text"
              )}>
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[250px] overflow-hidden rounded-b-lg">
              <MapView 
                establishments={mapEstablishments} 
                userLocation={userLocation} 
                onRefreshLocation={() => {}} 
                isLoadingLocation={false} 
                singleEstablishmentView={true} 
              />
            </CardContent>
          </Card>
          
          <Card className="vibrant-card">
            <CardHeader>
              <CardTitle className={cn(
                "text-lg",
                isLightTheme ? "text-gray-800" : "gradient-text"
              )}>
                Bar Crawl Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={cn(
                    "text-sm",
                    isLightTheme ? "text-gray-700" : ""
                  )}>
                    Currently participating:
                  </span>
                  <Badge variant="outline" className={establishment.inBarCrawl ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100"}>
                    {establishment.inBarCrawl ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <Button className="w-full" variant="gradient" onClick={handleBarCrawlRequest}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Request to Join Bar Crawl
                </Button>
                
                <div className={cn(
                  "text-xs mt-2",
                  isLightTheme ? "text-gray-600" : "text-material-on-surface-variant"
                )}>
                  Request this establishment to participate in upcoming bar crawls. The venue will receive your request and respond accordingly.
                </div>
              </div>
            </CardContent>
          </Card>
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
