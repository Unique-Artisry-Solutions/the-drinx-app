
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RecipeForm from './RecipeForm';
import { CreateRecipeDialogProps } from './types';

const CreateRecipeDialog: React.FC<CreateRecipeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  formProps
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recipe</DialogTitle>
          <DialogDescription>
            Share your mocktail creation with the community.
          </DialogDescription>
        </DialogHeader>
        
        <RecipeForm {...formProps} />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Recipe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
