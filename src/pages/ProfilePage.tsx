
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserAuth from '@/components/UserAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Check, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

const ProfilePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [favoriteEstablishments, setFavoriteEstablishments] = useState([]);
  const [barCrawlList, setBarCrawlList] = useState(sampleEstablishments.slice(0, 3));
  const [visitedEstablishments, setVisitedEstablishments] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('user_authenticated') === 'true';
    setIsAuthenticated(auth);
    
    if (auth) {
      setUserName(localStorage.getItem('user_name') || 'User');
      setUserEmail(localStorage.getItem('user_email') || '');
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUserName(localStorage.getItem('user_name') || 'User');
    setUserEmail(localStorage.getItem('user_email') || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const shareBarCrawl = () => {
    toast({
      title: 'Bar Crawl Shared',
      description: 'Your bar crawl list has been shared with users in your area!',
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="py-8">
          <h1 className="text-2xl font-medium text-material-on-background mb-6">Sign In</h1>
          <UserAuth onSuccess={handleAuthSuccess} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">My Profile</h1>
            <p className="text-material-on-surface-variant">
              Welcome back, {userName}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="barCrawl">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="barCrawl">Bar Crawl</TabsTrigger>
            <TabsTrigger value="visited">Visited</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="barCrawl">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">My Bar Crawl List</h2>
                <Button onClick={shareBarCrawl}>Share Bar Crawl</Button>
              </div>
              
              {barCrawlList.length > 0 ? (
                <div className="space-y-3">
                  {barCrawlList.map((est, index) => (
                    <Card key={est.id} className="relative">
                      <CardContent className="p-4 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-material-primary text-white flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{est.name}</h3>
                          <div className="flex items-center text-sm text-material-on-surface-variant">
                            <MapPin size={14} className="mr-1" />
                            {est.address}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-material-on-surface-variant">
                    You haven't added any establishments to your bar crawl list yet.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/explore')}
                  >
                    Explore Establishments
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="visited">
            <div className="space-y-4">
              <h2 className="font-medium">Places I've Visited</h2>
              
              {sampleEstablishments.slice(2, 5).map((est) => (
                <Card key={est.id} className="relative">
                  <CardContent className="p-4 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3">
                      <Check size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{est.name}</h3>
                      <div className="flex items-center text-sm text-material-on-surface-variant">
                        <span>Visited on {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-4">
              <h2 className="font-medium">My Favorite Mocktails</h2>
              
              {sampleCocktails.slice(0, 3).map((cocktail) => {
                // Fix: Properly handle price formatting for both string and number types
                let displayPrice: string;
                if (typeof cocktail.price === 'number') {
                  displayPrice = cocktail.price.toFixed(2);
                } else if (typeof cocktail.price === 'string') {
                  // Remove $ if it exists in the string
                  displayPrice = cocktail.price.replace('$', '');
                } else {
                  displayPrice = '0.00';
                }
                
                // Fix: Properly handle establishment that could be an object or string
                let establishmentName: string;
                if (typeof cocktail.establishment === 'object' && cocktail.establishment !== null) {
                  establishmentName = cocktail.establishment.name;
                } else if (typeof cocktail.establishment === 'string') {
                  establishmentName = cocktail.establishment;
                } else {
                  establishmentName = 'Unknown';
                }
                
                return (
                  <Card key={cocktail.id} className="relative">
                    <CardContent className="p-4 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-material-primary/10 flex items-center justify-center mr-3">
                        <Star size={16} className="text-material-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{cocktail.name}</h3>
                        <div className="flex items-center text-sm text-material-on-surface-variant">
                          <span>{establishmentName} · ${displayPrice}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <h2 className="font-medium">Reviews I've Written</h2>
              
              <div className="text-center py-8">
                <p className="text-material-on-surface-variant">
                  You haven't written any reviews yet.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate('/explore')}
                >
                  Explore Mocktails
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
