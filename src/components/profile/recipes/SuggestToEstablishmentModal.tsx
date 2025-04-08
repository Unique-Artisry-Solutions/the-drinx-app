
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRecipe, Establishment } from '@/types/DatabaseTypes';
import { useMocktailSuggestions } from '@/hooks/useMocktailSuggestions';
import { supabaseClient } from '@/lib/supabaseClient';

interface SuggestToEstablishmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: UserRecipe | null;
}

const SuggestToEstablishmentModal: React.FC<SuggestToEstablishmentModalProps> = ({ 
  open, 
  onOpenChange, 
  recipe 
}) => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string>('');
  const { toast } = useToast();
  const { suggestMocktail } = useMocktailSuggestions();

  // Fetch establishments when modal opens
  useEffect(() => {
    const fetchEstablishments = async () => {
      if (open) {
        setLoading(true);
        try {
          const { data, error } = await supabaseClient
            .from('establishments')
            .select('*')
            .order('name', { ascending: true });
          
          if (error) {
            throw error;
          }
          
          setEstablishments(data || []);
        } catch (error) {
          console.error('Error fetching establishments:', error);
          toast({
            title: 'Error',
            description: 'Failed to load establishments. Please try again.',
            variant: 'destructive'
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchEstablishments();
  }, [open, toast]);

  const handleSubmit = async () => {
    if (!recipe) return;
    if (!selectedEstablishment) {
      toast({
        title: 'Missing information',
        description: 'Please select an establishment.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await suggestMocktail.mutateAsync({
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        establishment_id: selectedEstablishment,
        user_id: recipe.user_id
      });
      
      onOpenChange(false);
      setSelectedEstablishment('');
      
      toast({
        title: 'Recipe suggested',
        description: 'Your recipe has been suggested to the selected establishment.'
      });
    } catch (error) {
      console.error('Error suggesting recipe:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggest Your Recipe</DialogTitle>
          <DialogDescription>
            Share your recipe with an establishment who might add it to their menu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="establishment">Select an establishment</Label>
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select
                value={selectedEstablishment}
                onValueChange={setSelectedEstablishment}
                disabled={suggestMocktail.isPending}
              >
                <SelectTrigger id="establishment">
                  <SelectValue placeholder="Select an establishment" />
                </SelectTrigger>
                <SelectContent>
                  {establishments.map((establishment) => (
                    <SelectItem key={establishment.id} value={establishment.id}>
                      {establishment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={suggestMocktail.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={suggestMocktail.isPending || !selectedEstablishment}>
            {suggestMocktail.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Suggest Recipe'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestToEstablishmentModal;
