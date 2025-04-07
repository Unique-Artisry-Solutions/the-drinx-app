
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMocktailSuggestions } from '@/hooks/useMocktailSuggestions';
import { useAuth } from '@/contexts/auth';
import BasicMocktailForm from '@/components/mocktail/BasicMocktailForm';
import { validateMocktailForm } from '@/components/mocktail/utils/validation';

interface SuggestMocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: string;
  establishmentName: string;
}

const SuggestMocktailModal: React.FC<SuggestMocktailModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
  establishmentName
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newUnit, setNewUnit] = useState('oz');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit?: string }[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { suggestMocktail } = useMocktailSuggestions();

  const handleSubmit = async () => {
    const validation = validateMocktailForm(name, ingredients, instructions);
    
    if (!validation.isValid) {
      toast({ title: "Error", description: validation.errorMessage });
      return;
    }

    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to submit your suggestion." 
      });
      return;
    }

    try {
      await suggestMocktail.mutateAsync({
        name,
        description,
        ingredients,
        instructions,
        establishment_id: establishmentId,
        user_id: user.id
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to suggest mocktail:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setInstructions('');
    setIngredients([]);
    setNewIngredient('');
    setNewAmount('1');
    setNewUnit('oz');
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suggest a Mocktail</DialogTitle>
          <DialogDescription>
            Share your mocktail recipe idea with {establishmentName}. If they like it, they might add it to their menu!
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
          newUnit={newUnit}
          setNewUnit={setNewUnit}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={suggestMocktail.isPending}
          >
            {suggestMocktail.isPending ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestMocktailModal;
