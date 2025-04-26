import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const [favoriteEstablishments, setFavoriteEstablishments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If not authenticated, get favorites from localStorage
          const storedFavorites = localStorage.getItem('favoriteEstablishments');
          if (storedFavorites) {
            setFavoriteEstablishments(JSON.parse(storedFavorites));
          }
          setIsLoading(false);
          return;
        }

        // Fetch favorites from Supabase
        const { data, error } = await supabase
          .from('favorites')
          .select('establishment_id')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data) {
          const favoriteIds = data.map(fav => fav.establishment_id);
          setFavoriteEstablishments(favoriteIds);
          
          // Sync with localStorage for offline access
          localStorage.setItem('favoriteEstablishments', JSON.stringify(favoriteIds));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        
        // Fallback to localStorage
        const storedFavorites = localStorage.getItem('favoriteEstablishments');
        if (storedFavorites) {
          setFavoriteEstablishments(JSON.parse(storedFavorites));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Toggle favorite status
  const toggleFavorite = async (establishmentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const isFavorite = favoriteEstablishments.includes(establishmentId);
      let newFavorites: string[];
      
      if (isFavorite) {
        // Remove from favorites
        newFavorites = favoriteEstablishments.filter(id => id !== establishmentId);
      } else {
        // Add to favorites
        newFavorites = [...favoriteEstablishments, establishmentId];
      }
      
      // Update local state first for immediate UI feedback
      setFavoriteEstablishments(newFavorites);
      
      // Update localStorage
      localStorage.setItem('favoriteEstablishments', JSON.stringify(newFavorites));
      
      // If user is authenticated, update Supabase
      if (user) {
        if (isFavorite) {
          // Remove from Supabase
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('establishment_id', establishmentId);
        } else {
          // Add to Supabase
          await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              establishment_id: establishmentId
            });
        }
      }
      
      // Show toast notification
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "Establishment removed from your favorites." 
          : "Establishment added to your favorites."
      });
      
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Could not update favorites",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return { 
    favoriteEstablishments, 
    toggleFavorite, 
    isLoading 
  };
};
