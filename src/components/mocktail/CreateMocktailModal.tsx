
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useAuth } from '@/contexts/auth';
import BasicMocktailForm from './BasicMocktailForm';
import { validateMocktailForm } from './utils/validation';
import CreateMocktailFooter from './CreateMocktailFooter';

interface CreateMocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMocktailModal: React.FC<CreateMocktailModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string }[]>([]);
  const [instructions, setInstructions] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { createRecipe } = useUserRecipes();

  const handleSubmit = async () => {
    const validation = validateMocktailForm(name, ingredients, instructions);
    
    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errorMessage });
      return;
    }

    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to save your recipe." 
      });
      return;
    }

    try {
      await createRecipe.mutateAsync({
        name,
        description,
        ingredients,
        instructions,
        is_public: isPublic,
        image_url: `https://placehold.co/300x200/9DB2BF/FFFFFF?text=${encodeURIComponent(name)}`
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIngredients([]);
    setNewIngredient('');
    setNewAmount('');
    setInstructions('');
    setIsPublic(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wine className="h-5 w-5 text-spiritless-pink" />
            Create Mocktail Recipe
          </DialogTitle>
          <DialogDescription>
            Share your mocktail recipe with the community. Be creative!
          </DialogDescription>
        </DialogHeader>

        <BasicMocktailForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          instructions={instructions}
          setInstructions={setInstructions}
          ingredients={ingredients}
          setIngredients={setIngredients}
          newIngredient={newIngredient}
          setNewIngredient={setNewIngredient}
          newAmount={newAmount}
          setNewAmount={setNewAmount}
        />

        <CreateMocktailFooter
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          onCancel={onClose}
          onSubmit={handleSubmit}
          isPending={createRecipe.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMocktailModal;
