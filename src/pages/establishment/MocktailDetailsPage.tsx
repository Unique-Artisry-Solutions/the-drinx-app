
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, TrendingUp, Clock, Tag, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import CommentForm from '@/components/CommentForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { CommentDisplayItem } from '@/types/DatabaseTypes';

const MocktailDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Sample data - in a real implementation, this would come from Supabase
  const [mocktail, setMocktail] = useState({
    id: '1',
    name: 'Blue Lagoon',
    description: 'A refreshing blend of blue curaçao syrup, lemon juice, and sprite, garnished with a lemon wheel and cherry.',
    ingredients: ['Blue Curaçao Syrup', 'Lemon Juice', 'Sprite'],
    price: '$8.99',
    rating: 4.7,
    totalOrders: 42,
    createdDate: '2023-10-15',
    photoUrl: 'https://placehold.co/600x400',
    reviews: [] as CommentDisplayItem[]
  });
  
  useEffect(() => {
    // Fetch reviews from Supabase
    fetchReviews();
  }, [id]);
  
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('cocktail_reviews_with_users')
        .select('*')
        .eq('cocktail_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedReviews: CommentDisplayItem[] = data.map(review => ({
          id: review.id || '',
          user: review.user_name || 'Anonymous',
          rating: review.rating || 0,
          text: review.text || '',
          date: review.created_at ? new Date(review.created_at).toLocaleDateString() : '',
          source: (review.source as 'app' | 'yelp') || 'app'
        }));
        
        setMocktail(prev => ({
          ...prev,
          reviews: formattedReviews
        }));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  
  const handleAddComment = async (data: { text: string; rating: number }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save comment to Supabase
      const { error } = await supabase
        .from('cocktail_reviews')
        .insert({
          user_id: user.id,
          cocktail_id: id,
          text: data.text,
          rating: data.rating,
          source: 'app'
        });
      
      if (error) throw error;
      
      // Refresh reviews
      await fetchReviews();
      
      setIsSubmitting(false);
      setShowCommentForm(false);
      
      toast({
        title: "Review added",
        description: "Your review has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding review:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to post your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleCommentForm = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }
    setShowCommentForm(prev => !prev);
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
                        <StarRating rating={Math.round(mocktail.rating)} interactive={false} />
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
                <div className="flex justify-between items-center">
                  <CardTitle>Customer Reviews</CardTitle>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={toggleCommentForm}
                    className="gap-1"
                  >
                    <MessageSquare size={16} />
                    {showCommentForm ? "Cancel" : "Add Review"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showCommentForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-background/50">
                    <CommentForm onSubmit={handleAddComment} isLoading={isSubmitting} />
                  </div>
                )}
              
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
                              <StarRating rating={review.rating} interactive={false} size={14} />
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
