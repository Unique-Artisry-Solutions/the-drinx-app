
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import RecipeForm from './RecipeForm';
import { EditRecipeDialogProps } from './types';

const EditRecipeDialog: React.FC<EditRecipeDialogProps> = ({
  recipe,
  onClose,
  onUpdate,
  isUpdating,
  formProps
}) => {
  // Prevent default form submission and call onUpdate without passing the event
  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    // Call onUpdate without any parameters
    onUpdate();
  };

  return (
    <Dialog 
      open={!!recipe} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {recipe && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Recipe</DialogTitle>
              <DialogDescription>
                Update your mocktail recipe.
              </DialogDescription>
            </DialogHeader>
            
            <RecipeForm {...formProps} />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={isUpdating}
                type="button"
              >
                {isUpdating ? "Saving..." : "Update Recipe"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeDialog;
