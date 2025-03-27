
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import ReviewForm from '@/components/ReviewForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ExternalLink, MapPin, Phone, Star, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

const EstablishmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any>(null);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<any[]>([
    { code: 'WELCOME20', discount: '20% off first drink', expires: '2023-12-31' },
    { code: 'MOCKTAIL10', discount: '$10 off for groups', expires: '2023-11-30' },
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const est = sampleEstablishments.find(e => e.id === id);
    setEstablishment(est);
    
    // Filter cocktails for this establishment
    const estCocktails = sampleCocktails.filter(c => c.establishment === est?.name);
    setCocktails(estCocktails);
    
    // Simulate active users (random number between 0 and 10)
    setActiveUsers(Math.floor(Math.random() * 11));
  }, [id]);

  const handleCheckIn = () => {
    if (!localStorage.getItem('user_authenticated')) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to check in at this establishment',
        variant: 'destructive',
      });
      return;
    }
    
    setHasCheckedIn(true);
    setActiveUsers(prev => prev + 1);
    
    toast({
      title: 'Checked In!',
      description: `You've checked in at ${establishment?.name}`,
    });
  };

  const handleAddToBarCrawl = () => {
    if (!localStorage.getItem('user_authenticated')) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add this to your bar crawl',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Added to Bar Crawl',
      description: `${establishment?.name} has been added to your bar crawl list`,
    });
  };

  const handleReviewSuccess = () => {
    setSelectedCocktail(null);
    toast({
      title: 'Review Added',
      description: 'Thank you for your feedback!',
    });
  };

  if (!establishment) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Loading establishment details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in pb-8">
        <div 
          className="h-40 bg-material-primary/10 rounded-xl mb-4 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${establishment.image || '/placeholder.svg'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="mb-2">
              {establishment.cocktailCount} Mocktails
            </Badge>
            <h1 className="text-2xl font-bold text-white">{establishment.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="cocktails">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="cocktails">Mocktails</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cocktails">
                <div className="space-y-4">
                  {cocktails.map((cocktail) => (
                    <div key={cocktail.id}>
                      <CocktailCard
                        id={cocktail.id}
                        name={cocktail.name}
                        price={cocktail.price}
                        description={cocktail.description}
                        ingredients={cocktail.ingredients}
                        image={cocktail.image}
                        establishment={cocktail.establishment}
                      />
                      <div className="mt-2 mb-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCocktail(cocktail.id === selectedCocktail ? null : cocktail.id)}
                        >
                          Write a Review
                        </Button>
                        
                        {selectedCocktail === cocktail.id && (
                          <div className="mt-3">
                            <ReviewForm
                              cocktailId={cocktail.id}
                              cocktailName={cocktail.name}
                              onSuccess={handleReviewSuccess}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-material-primary" />
                        <span>{establishment.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-material-primary" />
                        <span>555-123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="h-5 w-5 mr-2 text-material-primary" />
                        <a href="#" className="text-material-primary hover:underline">
                          Visit Website
                        </a>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="font-medium mb-2">Business Hours</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Monday - Thursday</div>
                          <div>11:00 AM - 10:00 PM</div>
                          <div>Friday - Saturday</div>
                          <div>11:00 AM - 12:00 AM</div>
                          <div>Sunday</div>
                          <div>12:00 PM - 9:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Yelp Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-material-on-surface-variant">
                        Reviews powered by Yelp
                      </p>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">John D.</h3>
                              <div className="flex ml-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star} 
                                    size={14} 
                                    className={star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-material-on-surface-variant mt-1">
                              August 15, 2023
                            </p>
                            <p className="mt-2">
                              Love their selection of non-alcoholic drinks! The Berry Blast mocktail was amazing.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">Sarah T.</h3>
                              <div className="flex ml-2">
                                {[1, 2, 3, 4].map(star => (
                                  <Star 
                                    key={star} 
                                    size={14} 
                                    className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-material-on-surface-variant mt-1">
                              July 28, 2023
                            </p>
                            <p className="mt-2">
                              Great atmosphere and friendly staff. The mocktails were a bit pricey but worth it for the quality.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <a 
                        href="#"
                        className="block text-center text-material-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View more reviews on Yelp
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="promotions">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Promotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {promotions.length > 0 ? (
                      <div className="space-y-4">
                        {promotions.map((promo, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{promo.discount}</h3>
                                <p className="text-sm text-material-on-surface-variant mt-1">
                                  Expires: {promo.expires}
                                </p>
                              </div>
                              <div className="bg-material-primary/10 px-3 py-1 rounded font-mono text-material-primary">
                                {promo.code}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-material-on-surface-variant">
                        No active promotions at this time
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-material-primary" />
                    <span>{activeUsers} people here now</span>
                  </div>
                  {hasCheckedIn ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check size={12} className="mr-1" /> Checked In
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={handleCheckIn}>
                      Check In
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleAddToBarCrawl}
                  >
                    <Plus size={16} className="mr-2" />
                    Add to Bar Crawl
                  </Button>
                  
                  <Link to={`/map?highlight=${id}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin size={16} className="mr-2" />
                      View on Map
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Google Maps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                  <p className="text-material-on-surface-variant text-sm">
                    Google Maps integration will be displayed here
                  </p>
                </div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(establishment.address)}`}
                  className="block text-center text-material-primary hover:underline mt-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentDetail;
