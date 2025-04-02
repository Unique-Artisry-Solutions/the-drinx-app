
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, TrendingUp, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MocktailDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Sample data - in a real implementation, this would come from Supabase
  const mocktail = {
    id: '1',
    name: 'Blue Lagoon',
    description: 'A refreshing blend of blue curaçao syrup, lemon juice, and sprite, garnished with a lemon wheel and cherry.',
    ingredients: ['Blue Curaçao Syrup', 'Lemon Juice', 'Sprite'],
    price: '$8.99',
    rating: 4.7,
    totalOrders: 42,
    createdDate: '2023-10-15',
    photoUrl: 'https://placehold.co/600x400',
    reviews: [
      { id: '1', user: 'Sarah J.', rating: 5, comment: 'So refreshing! Love the blue color and citrus flavor.', date: '2023-11-29' },
      { id: '2', user: 'Michael R.', rating: 4, comment: 'Great drink, though a bit sweet for my taste.', date: '2023-11-28' },
      { id: '3', user: 'Emily L.', rating: 5, comment: 'My favorite drink here! Perfect balance of flavors.', date: '2023-11-25' }
    ]
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Layout>
      <div className="animate-fade-in p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="vibrant-card overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src={mocktail.photoUrl} 
                  alt={mocktail.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold gradient-text">{mocktail.name}</h1>
                    <div className="flex items-center mt-2">
                      <div className="flex mr-2">
                        {renderStars(mocktail.rating)}
                      </div>
                      <span className="text-material-on-surface-variant text-sm">
                        {mocktail.rating} ({mocktail.reviews.length} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-spiritless-pink">
                    {mocktail.price}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-lg font-medium mb-2">Description</h2>
                  <p className="text-material-on-surface">
                    {mocktail.description}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-lg font-medium mb-2">Ingredients</h2>
                  <div className="flex flex-wrap gap-2">
                    {mocktail.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="bg-spiritless-pink/10 text-spiritless-pink border-spiritless-pink/20">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="vibrant-card">
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mocktail.reviews.length === 0 ? (
                  <p className="text-material-on-surface-variant">No reviews yet.</p>
                ) : (
                  mocktail.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-spiritless-pink to-spiritless-orange flex items-center justify-center text-white font-medium">
                            {review.user.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{review.user}</div>
                            <div className="flex mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-material-on-surface-variant">
                          {review.date}
                        </div>
                      </div>
                      <div className="mt-2 pl-11">
                        <p className="text-material-on-surface">{review.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="vibrant-card">
              <CardHeader>
                <CardTitle>Performance Stats</CardTitle>
                <CardDescription>How this mocktail is performing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-spiritless-green mr-2" />
                    <div>
                      <div className="text-sm font-medium">Total Orders</div>
                      <div className="text-xl font-bold">{mocktail.totalOrders}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-spiritless-green/10 text-spiritless-green border-spiritless-green/20">
                    Top Seller
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">Average Rating</div>
                      <div className="text-xl font-bold">{mocktail.rating}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Highly Rated
                  </Badge>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-spiritless-orange mr-2" />
                  <div>
                    <div className="text-sm font-medium">Added on</div>
                    <div className="text-sm">{mocktail.createdDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="vibrant-card">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="gradient" className="w-full">
                  Edit Mocktail
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Promotion
                </Button>
                <Button variant="outline" className="w-full text-destructive border-destructive">
                  Remove from Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MocktailDetailsPage;
