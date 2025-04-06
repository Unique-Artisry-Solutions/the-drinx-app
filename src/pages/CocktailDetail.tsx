
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Heart, Share2, MessageSquare, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CommentForm from '@/components/CommentForm';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/contexts/auth';

// Sample data - would be fetched from API in a real application
import { sampleCocktails } from '@/data/sampleData';

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
  source: 'app' | 'yelp';
  rating?: number;
}

const CocktailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [cocktail, setCocktail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [lastOrdered, setLastOrdered] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { toast } = useToast();
  const { user, isEmailVerified } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const foundCocktail = sampleCocktails.find(c => c.id === id);
    
    if (foundCocktail) {
      setCocktail(foundCocktail);
      // Simulate like count (random number between 0 and 30)
      setLikeCount(Math.floor(Math.random() * 31));
      
      // Simulate last ordered (random date within last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      setLastOrdered(date.toLocaleDateString());
      
      // Simulate comments
      const sampleComments: Comment[] = [
        {
          id: '1',
          user: 'Alex M.',
          text: 'Really enjoyed this mocktail! Perfect balance of sweetness and acidity.',
          date: '3 days ago',
          source: 'app',
          rating: 5,
        },
        {
          id: '2',
          user: 'Sarah J.',
          text: 'The presentation is beautiful, and the taste doesn\'t disappoint!',
          date: '1 week ago',
          source: 'yelp',
          rating: 5,
        },
        {
          id: '3',
          user: 'Michael L.',
          text: 'A bit too sweet for my taste, but still refreshing.',
          date: '2 weeks ago',
          source: 'yelp',
          rating: 3,
        }
      ];
      
      setComments(sampleComments);
    }
    
    setLoading(false);
  }, [id]);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast({
        title: "Added to favorites",
        description: "This mocktail has been added to your favorites.",
      });
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
      toast({
        title: "Removed from favorites",
        description: "This mocktail has been removed from your favorites.",
      });
    }
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share feature",
      description: "Sharing functionality would be implemented here.",
    });
  };

  const handleOrderedToday = () => {
    const today = new Date().toLocaleDateString();
    setLastOrdered(today);
    toast({
      title: "Ordered today!",
      description: "We've recorded that you enjoyed this mocktail today.",
    });
  };
  
  const handleAddComment = (data: { text: string; rating: number }) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newComment: Comment = {
        id: `new-${Date.now()}`,
        user: user?.email?.split('@')[0] || 'User',
        text: data.text,
        date: 'Just now',
        source: 'app',
        rating: data.rating,
      };
      
      setComments([newComment, ...comments]);
      setIsSubmitting(false);
      setShowCommentForm(false);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    }, 1000);
  };
  
  const toggleCommentForm = () => {
    if (!user || !isEmailVerified) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a comment.",
        variant: "destructive",
      });
      return;
    }
    
    setShowCommentForm(prev => !prev);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Loading cocktail details...</p>
        </div>
      </Layout>
    );
  }

  if (!cocktail) {
    return (
      <Layout>
        <div className="py-8 text-center">
          <p>Cocktail not found.</p>
          <Link to="/explore" className="text-material-primary hover:underline mt-4 inline-block">
            Explore other mocktails
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <div 
                className="h-64 w-full rounded-xl bg-cover bg-center mb-4"
                style={{ backgroundImage: `url(${cocktail.image || '/placeholder.svg'})` }}
              />
              
              <h1 className="text-2xl font-bold mb-2">{cocktail.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {cocktail.ingredients?.map((ingredient: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-material-secondary-container/50">
                    {ingredient}
                  </Badge>
                ))}
              </div>
              
              <p className="text-material-on-surface">{cocktail.description}</p>
              
              <div className="mt-4 flex items-center text-material-on-surface-variant">
                <MapPin size={16} className="mr-1" />
                <span>
                  {typeof cocktail.establishment === 'object' 
                    ? cocktail.establishment.name 
                    : cocktail.establishment}
                </span>
                <span className="mx-2 text-material-on-surface-variant">•</span>
                <span>{cocktail.price}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                variant={liked ? "default" : "outline"} 
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className={liked ? "fill-white" : ""} size={16} />
                {liked ? "Favorited" : "Add to Favorites"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 size={16} />
                Share
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleOrderedToday}
                className="gap-2"
              >
                <Clock size={16} />
                I Had This Today
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Comments & Reviews</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleCommentForm}
                    className="gap-1"
                  >
                    <MessageSquare size={16} />
                    {showCommentForm ? "Cancel" : "Add Comment"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showCommentForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-background/50">
                    <CommentForm onSubmit={handleAddComment} isLoading={isSubmitting} />
                  </div>
                )}
                
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-material-primary/20 flex items-center justify-center mr-2">
                            {comment.user.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{comment.user}</p>
                            <p className="text-xs text-material-on-surface-variant">{comment.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {comment.source === 'yelp' && (
                            <>
                              <Badge variant="outline" className="mr-2">Yelp</Badge>
                            </>
                          )}
                          
                          {comment.source === 'app' && (
                            <Badge variant="outline" className="bg-material-primary/10 text-material-primary">
                              App User
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {comment.rating && (
                        <div className="mt-1 ml-10">
                          <StarRating rating={comment.rating} interactive={false} size={14} />
                        </div>
                      )}
                      
                      <p className="mt-2 text-material-on-surface ml-10">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <p className="text-center text-material-on-surface-variant py-4">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="flex justify-center">
                    <div className="bg-material-primary/10 rounded-full h-20 w-20 flex items-center justify-center">
                      <Heart size={32} className="text-material-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mt-2">{likeCount}</h3>
                  <p className="text-material-on-surface-variant">People love this mocktail</p>
                </div>
                
                {lastOrdered && (
                  <div className="text-center pt-4 border-t">
                    <p className="text-material-on-surface-variant">Last ordered</p>
                    <p className="font-medium">{lastOrdered}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Mocktails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleCocktails
                    .filter(c => c.id !== cocktail.id)
                    .slice(0, 3)
                    .map(c => (
                      <Link key={c.id} to={`/cocktail/${c.id}`}>
                        <div className="flex items-center p-2 rounded-lg hover:bg-material-primary/5 transition-colors">
                          <div 
                            className="h-12 w-12 rounded-md bg-cover bg-center mr-3"
                            style={{ backgroundImage: `url(${c.image || '/placeholder.svg'})` }}
                          />
                          <div>
                            <h4 className="font-medium">{c.name}</h4>
                            <p className="text-xs text-material-on-surface-variant">
                              {typeof c.establishment === 'object' 
                                ? c.establishment.name 
                                : c.establishment}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CocktailDetail;
