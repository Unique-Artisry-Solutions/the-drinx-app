
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { StarRating } from '@/components/StarRating';

interface CommentFormProps {
  onSubmit?: (data: { text: string; rating: number }) => void;
  isLoading?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  onSubmit = () => console.warn('No submit handler provided'), 
  isLoading = false 
}) => {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      text: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      onSubmit({ text: data.text ?? '', rating });
      form.reset();
      setRating(0);
    } catch (error) {
      console.error('Comment submission failed:', error);
      toast({
        title: 'Submission failed',
        description: 'Failed to submit comment. Please try again.',
        variant: 'destructive',
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Rating</label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating ?? (() => {})} 
          />
        </div>
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts about this mocktail..."
                  rows={4}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Post Comment'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
