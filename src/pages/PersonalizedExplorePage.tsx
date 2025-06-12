import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Share2, Star, MapPin, Clock, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import PromoterDiscoverySection from '@/components/explore/PromoterDiscoverySection';
import SwigCircuitRecommendations from '@/components/explore/SwigCircuitRecommendations';
import type { Promoter } from '@/types/explore';

const PersonalizedExplorePage = () => {
  const {
    recommendations,
    isLoading,
    activeCategory,
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  } = usePersonalizedRecommendations();

  // Mock promoter data
  const mockPromoters: Promoter[] = [
    {
      id: 'p1',
      name: 'Mindful Events Co.',
      description: 'Creating transformative experiences through mindful gatherings and wellness-focused events.',
      avatar_url: '/api/placeholder/64/64',
      follower_count: 2340,
      event_count: 15,
      category: 'Wellness',
      location: 'San Francisco',
      rating: 4.8,
      tags: ['mindfulness', 'wellness', 'community'],
      is_verified: true
    },
    {
      id: 'p2',
      name: 'Urban Discovery',
      description: 'Exploring the hidden gems of city life through curated experiences and local connections.',
      avatar_url: '/api/placeholder/64/64',
      follower_count: 1850,
      event_count: 22,
      category: 'Urban Exploration',
      location: 'Los Angeles',
      rating: 4.6,
      tags: ['urban', 'discovery', 'local'],
      is_verified: false
    },
    {
      id: 'p3',
      name: 'Craft & Culture',
      description: 'Celebrating artisanal crafts and cultural experiences in intimate, curated settings.',
      avatar_url: '/api/placeholder/64/64',
      follower_count: 3120,
      event_count: 18,
      category: 'Arts & Culture',
      location: 'New York',
      rating: 4.9,
      tags: ['crafts', 'culture', 'artisanal'],
      is_verified: true
    },
    {
      id: 'p4',
      name: 'Social Sips',
      description: 'Bringing people together through innovative mocktail experiences and social gatherings.',
      avatar_url: '/api/placeholder/64/64',
      follower_count: 1642,
      event_count: 12,
      category: 'Social',
      location: 'Seattle',
      rating: 4.7,
      tags: ['social', 'mocktails', 'community'],
      is_verified: false
    }
  ];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'establishment': return '🏢';
      case 'cocktail': return '🍹';
      case 'event': return '📅';
      case 'swig-circuit': return '🚶';
      default: return '✨';
    }
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'establishment': return 'bg-blue-100 text-blue-800';
      case 'cocktail': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'swig-circuit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const otherRecommendations = recommendations.filter(rec => rec.type !== 'swig-circuit');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Personalized For You</h1>
          <p className="text-muted-foreground">
            Discover experiences tailored to your preferences and interests
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="establishments">Bars</TabsTrigger>
            <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="swig-circuits">Circuits</TabsTrigger>
          </TabsList>

          <div className="space-y-8">
            {/* Swig Circuits Section - Always show when available */}
            <SwigCircuitRecommendations 
              recommendations={recommendations}
              onSave={saveRecommendation}
              onShare={shareRecommendation}
              isLoading={isLoading}
            />

            {/* Popular Promoters Section */}
            <PromoterDiscoverySection 
              promoters={mockPromoters}
              isLoading={isLoading}
            />

            {/* Other Recommendations */}
            {otherRecommendations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">More Recommendations</h3>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherRecommendations.map(recommendation => (
                      <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div 
                          className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative"
                          style={{ 
                            backgroundImage: `url(${recommendation.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <Badge className={getRecommendationTypeColor(recommendation.type)}>
                              {getRecommendationIcon(recommendation.type)} {recommendation.type}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveRecommendation(recommendation.id)}
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                            >
                              {recommendation.isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-white" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                          {recommendation.trending && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-spiritless-pink text-white text-xs">
                                🔥 Trending
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{recommendation.title}</h3>
                            {recommendation.rating && (
                              <div className="flex items-center ml-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium ml-1">{recommendation.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {recommendation.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            {recommendation.distance && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {recommendation.distance}
                              </div>
                            )}
                            {recommendation.price && (
                              <div className="font-medium">{recommendation.price}</div>
                            )}
                            {recommendation.availability && (
                              <div className={`px-2 py-1 rounded text-xs ${
                                recommendation.availability === 'open' ? 'bg-green-100 text-green-800' :
                                recommendation.availability === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {recommendation.availability === 'open' ? 'Open' :
                                 recommendation.availability === 'closing-soon' ? 'Closing Soon' :
                                 'Closed'}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-spiritless-pink font-medium mb-3">
                            💡 {recommendation.reason}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Explore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => shareRecommendation(recommendation.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Individual category tabs */}
                <TabsContent value="establishments" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.filter(r => r.type === 'establishment').map(recommendation => (
                      <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div 
                          className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative"
                          style={{ 
                            backgroundImage: `url(${recommendation.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <Badge className={getRecommendationTypeColor(recommendation.type)}>
                              {getRecommendationIcon(recommendation.type)} {recommendation.type}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveRecommendation(recommendation.id)}
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                            >
                              {recommendation.isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-white" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                          {recommendation.trending && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-spiritless-pink text-white text-xs">
                                🔥 Trending
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{recommendation.title}</h3>
                            {recommendation.rating && (
                              <div className="flex items-center ml-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium ml-1">{recommendation.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {recommendation.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            {recommendation.distance && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {recommendation.distance}
                              </div>
                            )}
                            {recommendation.price && (
                              <div className="font-medium">{recommendation.price}</div>
                            )}
                            {recommendation.availability && (
                              <div className={`px-2 py-1 rounded text-xs ${
                                recommendation.availability === 'open' ? 'bg-green-100 text-green-800' :
                                recommendation.availability === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {recommendation.availability === 'open' ? 'Open' :
                                 recommendation.availability === 'closing-soon' ? 'Closing Soon' :
                                 'Closed'}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-spiritless-pink font-medium mb-3">
                            💡 {recommendation.reason}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Explore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => shareRecommendation(recommendation.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="cocktails" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.filter(r => r.type === 'cocktail').map(recommendation => (
                      <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div 
                          className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative"
                          style={{ 
                            backgroundImage: `url(${recommendation.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <Badge className={getRecommendationTypeColor(recommendation.type)}>
                              {getRecommendationIcon(recommendation.type)} {recommendation.type}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveRecommendation(recommendation.id)}
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                            >
                              {recommendation.isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-white" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                          {recommendation.trending && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-spiritless-pink text-white text-xs">
                                🔥 Trending
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{recommendation.title}</h3>
                            {recommendation.rating && (
                              <div className="flex items-center ml-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium ml-1">{recommendation.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {recommendation.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            {recommendation.distance && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {recommendation.distance}
                              </div>
                            )}
                            {recommendation.price && (
                              <div className="font-medium">{recommendation.price}</div>
                            )}
                            {recommendation.availability && (
                              <div className={`px-2 py-1 rounded text-xs ${
                                recommendation.availability === 'open' ? 'bg-green-100 text-green-800' :
                                recommendation.availability === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {recommendation.availability === 'open' ? 'Open' :
                                 recommendation.availability === 'closing-soon' ? 'Closing Soon' :
                                 'Closed'}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-spiritless-pink font-medium mb-3">
                            💡 {recommendation.reason}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Explore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => shareRecommendation(recommendation.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.filter(r => r.type === 'event').map(recommendation => (
                      <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div 
                          className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative"
                          style={{ 
                            backgroundImage: `url(${recommendation.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute top-3 left-3">
                            <Badge className={getRecommendationTypeColor(recommendation.type)}>
                              {getRecommendationIcon(recommendation.type)} {recommendation.type}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveRecommendation(recommendation.id)}
                              className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                            >
                              {recommendation.isSaved ? (
                                <BookmarkCheck className="h-4 w-4 text-white" />
                              ) : (
                                <Bookmark className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          </div>
                          {recommendation.trending && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-spiritless-pink text-white text-xs">
                                🔥 Trending
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{recommendation.title}</h3>
                            {recommendation.rating && (
                              <div className="flex items-center ml-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium ml-1">{recommendation.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {recommendation.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            {recommendation.distance && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {recommendation.distance}
                              </div>
                            )}
                            {recommendation.price && (
                              <div className="font-medium">{recommendation.price}</div>
                            )}
                            {recommendation.availability && (
                              <div className={`px-2 py-1 rounded text-xs ${
                                recommendation.availability === 'open' ? 'bg-green-100 text-green-800' :
                                recommendation.availability === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {recommendation.availability === 'open' ? 'Open' :
                                 recommendation.availability === 'closing-soon' ? 'Closing Soon' :
                                 'Closed'}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-spiritless-pink font-medium mb-3">
                            💡 {recommendation.reason}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Explore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => shareRecommendation(recommendation.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="swig-circuits" className="mt-0">
                  <SwigCircuitRecommendations 
                    recommendations={recommendations}
                    onSave={saveRecommendation}
                    onShare={shareRecommendation}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
