import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import CommentForm from '@/components/CommentForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { CommentDisplayItem } from '@/types/DatabaseTypes';
import ReportButton from '@/components/ui/report-button';

interface CommentsSectionProps {
  cocktailId: string;
  comments: CommentDisplayItem[];
  onCommentsUpdate: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  cocktailId, 
  comments,
  onCommentsUpdate
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isEmailVerified } = useAuth();
  
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
  
  const handleAddComment = async (data: { text: string; rating: number }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a comment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('cocktail_reviews')
        .insert({
          user_id: user.id,
          cocktail_id: cocktailId,
          text: data.text,
          rating: data.rating,
          source: 'app'
        });
      
      if (error) throw error;
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
      
      onCommentsUpdate();
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                    <Badge variant="outline" className="mr-2">Yelp</Badge>
                  )}
                  
                  {comment.source === 'app' && (
                    <Badge variant="outline" className="bg-material-primary/10 text-material-primary mr-2">
                      App User
                    </Badge>
                  )}
                  
                  <ReportButton 
                    contentType="review" 
                    contentId={comment.id} 
                    variant="ghost" 
                    size="sm"
                  />
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
  );
};

export default CommentsSection;
