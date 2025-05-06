
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';

interface SuggestToEstablishmentModalProps {
  recipe: UserRecipe;
  onClose: () => void;
}

const SuggestToEstablishmentModal: React.FC<SuggestToEstablishmentModalProps> = ({
  recipe,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Mock API call to suggest recipe
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Recipe suggested",
        description: "Your mocktail recipe has been suggested to establishments."
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggest Recipe to Establishments</DialogTitle>
          <DialogDescription>
            Share your "{recipe.name}" recipe with local establishments who might feature it on their menu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Your recipe will be shared with selected establishments, who may contact you if they're interested in featuring it.
          </p>
          
          <div className="rounded border p-3 bg-muted/50">
            <h3 className="font-medium">{recipe.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{recipe.description || "No description"}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Suggestion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestToEstablishmentModal;
