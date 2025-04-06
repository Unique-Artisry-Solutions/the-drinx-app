
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CommentDisplayItem } from '@/types/DatabaseTypes';

export const useCocktailComments = (cocktailId: string | undefined) => {
  const [comments, setComments] = useState<CommentDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!cocktailId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cocktail_reviews_with_users')
        .select('*')
        .eq('cocktail_id', cocktailId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedComments: CommentDisplayItem[] = data.map(comment => ({
          id: comment.id || '',
          user: comment.user_name || 'Anonymous',
          text: comment.text || '',
          date: comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '',
          source: (comment.source as 'app' | 'yelp') || 'app',
          rating: comment.rating || undefined
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [cocktailId]);

  return { comments, loading, refetchComments: fetchComments };
};
