
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  establishmentId?: string;
  onSubmit?: (review: ReviewData) => void;
  className?: string;
}

interface ReviewData {
  rating: number;
  comment: string;
  establishmentId?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  establishmentId,
  onSubmit,
  className = ""
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: 'Review too short',
        description: 'Please write at least 10 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewData = {
        rating,
        comment: comment.trim(),
        establishmentId
      };

      if (onSubmit) {
        await onSubmit(reviewData);
      }

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });

      // Reset form
      setRating(0);
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
