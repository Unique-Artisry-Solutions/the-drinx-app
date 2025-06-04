import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { sampleCocktails } from '@/data/sampleData';
import CocktailHeader from '@/components/cocktail/CocktailHeader';
import CocktailActions from '@/components/cocktail/CocktailActions';
import CommentsSection from '@/components/cocktail/CommentsSection';
import CocktailSidebar from '@/components/cocktail/CocktailSidebar';
import { useCocktailComments } from '@/hooks/useCocktailComments';

const CocktailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [cocktail, setCocktail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [lastOrdered, setLastOrdered] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { comments, refetchComments } = useCocktailComments(id);

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

  const similarCocktails = sampleCocktails
    .filter(c => c.id !== cocktail.id)
    .slice(0, 3);

  return (
    <Layout>
      <div className="animate-fade-in pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CocktailHeader 
              name={cocktail.name} 
              image={cocktail.image} 
              ingredients={cocktail.ingredients} 
              description={cocktail.description} 
              establishment={cocktail.establishment} 
              price={cocktail.price}
            />
            
            <CocktailActions 
              liked={liked} 
              onLike={handleLike} 
              onShare={handleShare} 
              onOrderedToday={handleOrderedToday}
            />
            
            <CommentsSection 
              cocktailId={id!}
              comments={comments} 
              onCommentsUpdate={refetchComments}
            />
          </div>
          
          <div>
            <CocktailSidebar 
              likeCount={likeCount} 
              lastOrdered={lastOrdered}
              similarCocktails={similarCocktails}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CocktailDetail;
