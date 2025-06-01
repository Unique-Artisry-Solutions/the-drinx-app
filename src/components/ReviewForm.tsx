
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  cocktailId: string;
  cocktailName: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ cocktailName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would call an API endpoint to save the review
    setTimeout(() => {
      toast({
        title: 'Review submitted',
        description: 'Thanks for sharing your feedback!',
      });
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={24}
            className={`cursor-pointer transition-colors ${
              (hoverRating || rating) >= starValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          />
        );
      });
  };

  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-material-on-surface-variant mb-4">
              Please sign in to leave a review
            </p>
            <Button onClick={() => window.location.href = '/profile'}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              How would you rate {cocktailName}?
            </label>
            <div className="flex gap-1">{renderStars()}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="comment">
              Your Review
            </label>
            <Textarea
              id="comment"
              placeholder="Tell others what you thought of this mocktail..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
