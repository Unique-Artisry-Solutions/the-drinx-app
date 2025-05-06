
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
  // Prevent default form submission
  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    onUpdate(e);
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
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={isUpdating}
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
