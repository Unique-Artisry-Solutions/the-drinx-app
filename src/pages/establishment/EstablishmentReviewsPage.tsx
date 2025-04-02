
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EstablishmentReviewsPage: React.FC = () => {
  // Sample data - in a real implementation, this would come from Supabase
  const reviews = [
    {
      id: '1',
      user: 'Sarah J.',
      rating: 5,
      comment: 'The mocktails here are amazing! The Blue Lagoon was refreshing and perfectly balanced. Great atmosphere too!',
      date: '2023-11-29',
      isNew: true
    },
    {
      id: '2',
      user: 'Michael R.',
      rating: 4,
      comment: 'Very creative mocktail menu. I tried the Tropical Paradise and it was delicious. The service was great too.',
      date: '2023-11-28',
      isNew: true
    },
    {
      id: '3',
      user: 'Emily L.',
      rating: 5,
      comment: 'This place is perfect for socializing without alcohol. The drinks are top-notch and the staff is very knowledgeable.',
      date: '2023-11-27',
      isNew: true
    },
    {
      id: '4',
      user: 'James W.',
      rating: 4,
      comment: 'Great selection of mocktails. The atmosphere is wonderful for hanging out with friends.',
      date: '2023-11-25',
      isNew: false
    },
    {
      id: '5',
      user: 'Alex T.',
      rating: 3,
      comment: 'Nice place, but a bit crowded on weekends. The mocktails are good though.',
      date: '2023-11-22',
      isNew: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Layout>
      <div className="animate-fade-in p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text mb-4">Customer Reviews</h1>
        <p className="text-material-on-surface-variant mb-6">
          See what customers are saying about your establishment
        </p>
        
        <div className="mb-8">
          <Card className="vibrant-card">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center">
                  <div className="text-5xl font-bold">4.7</div>
                  <div className="flex justify-center mt-2">
                    {renderStars(5)}
                  </div>
                  <div className="text-sm text-material-on-surface-variant mt-1">Average Rating</div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center">
                    <div className="w-24 text-sm">5 stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm">70%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">4 stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="text-sm">20%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">3 stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <div className="text-sm">10%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">2 stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-sm">0%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm">1 star</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-sm">0%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Recent Reviews</h2>
          
          {reviews.map((review) => (
            <Card key={review.id} className={`vibrant-card ${review.isNew ? 'border-spiritless-pink/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-spiritless-pink to-spiritless-orange flex items-center justify-center text-white font-medium">
                      {review.user.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{review.user}</div>
                      <div className="flex mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-material-on-surface-variant">
                    <Calendar className="h-4 w-4 mr-1" />
                    {review.date}
                    {review.isNew && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-spiritless-pink/10 text-spiritless-pink rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-material-on-surface">{review.comment}</p>
                </div>
                
                {review.isNew && (
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">Reply</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentReviewsPage;
