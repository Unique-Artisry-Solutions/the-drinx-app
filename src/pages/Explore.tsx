
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CategoryTabs from '@/components/CategoryTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, TrendingUp, Users, Clock, Calendar } from 'lucide-react';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';

const Explore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'popular':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Top Rated Establishments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">The Mocktail Lounge</h4>
                        <p className="text-sm text-muted-foreground">Downtown</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Zero Proof Kitchen</h4>
                        <p className="text-sm text-muted-foreground">Midtown</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.7</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Popular Mocktails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Virgin Mojito</h4>
                      <p className="text-sm text-muted-foreground">Most ordered this week</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Elderflower Spritz</h4>
                      <p className="text-sm text-muted-foreground">Trending in your area</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Nearby Hotspots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Sober Social Club</h4>
                      <p className="text-sm text-muted-foreground">0.5 miles away</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Dry Bar & Grill</h4>
                      <p className="text-sm text-muted-foreground">0.8 miles away</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'trending':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trending Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">🔥 Spicy Ginger Mule</h3>
                    <p className="text-sm text-muted-foreground mb-2">A fiery twist on the classic mule</p>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span>+156% this week</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">🌿 Cucumber Mint Cooler</h3>
                    <p className="text-sm text-muted-foreground mb-2">Refreshing summer favorite</p>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span>+89% this week</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'new':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>New Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                      NEW
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Lavender Lemonade</h3>
                      <p className="text-sm text-muted-foreground">Just added at The Garden Bar</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Added 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                      NEW
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Smoke & Mirrors</h3>
                      <p className="text-sm text-muted-foreground">New at Zero Proof Downtown</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Added 5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'personalized':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>For You</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Based on your preferences and activity, here are some recommendations:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Recommended Mocktails</h3>
                    <div className="space-y-2">
                      <div className="text-sm">• Hibiscus Fizz (fruity preference)</div>
                      <div className="text-sm">• Ginger Turmeric Tonic (spicy preference)</div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Suggested Venues</h3>
                    <div className="space-y-2">
                      <div className="text-sm">• Botanical Bar (near you)</div>
                      <div className="text-sm">• The Herb Garden (similar taste)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'swig-circuits':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Swig Circuits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Downtown Discovery</h3>
                    <p className="text-sm text-muted-foreground mb-2">Explore 5 venues in the heart of the city</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Dec 15, 2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        <span>12 participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Cocktail Craft Tour</h3>
                    <p className="text-sm text-muted-foreground mb-2">Learn mixology at top mocktail spots</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Dec 18, 2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        <span>8 participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'promoters':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Promoters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        MC
                      </div>
                      <div>
                        <h3 className="font-semibold">Mocktail Central</h3>
                        <p className="text-xs text-muted-foreground">Event Organizer</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Specializing in premium non-alcoholic experiences
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="h-3 w-3" />
                      <span>2.1k followers</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        SE
                      </div>
                      <div>
                        <h3 className="font-semibold">Sober Events Co</h3>
                        <p className="text-xs text-muted-foreground">Community Builder</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Creating inclusive social experiences for all
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="h-3 w-3" />
                      <span>1.8k followers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover new mocktails, venues, and experiences in your area
          </p>
        </div>

        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mt-6">
          {renderCategoryContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
