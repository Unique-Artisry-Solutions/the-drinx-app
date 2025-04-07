
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CreateMocktailFooterProps {
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

const CreateMocktailFooter: React.FC<CreateMocktailFooterProps> = ({
  isPublic,
  setIsPublic,
  onCancel,
  onSubmit,
  isPending
}) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded border-gray-300 text-spiritless-pink focus:ring-spiritless-pink"
        />
        <Label htmlFor="isPublic">Make this recipe public for everyone to see</Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={onSubmit} 
          disabled={isPending}
          className="bg-spiritless-pink hover:bg-spiritless-pink/90"
        >
          {isPending ? "Saving..." : "Save Recipe"}
        </Button>
      </DialogFooter>
    </>
  );
};

export default CreateMocktailFooter;
