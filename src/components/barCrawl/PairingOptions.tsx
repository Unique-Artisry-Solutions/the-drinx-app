
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, UtensilsCrossed, Wine, Trash2 } from 'lucide-react';

export interface Pairing {
  id: string;
  drinkName: string;
  foodItem: string;
  description: string;
}

interface PairingOptionsProps {
  pairings: Pairing[];
  onPairingsChange: (pairings: Pairing[]) => void;
}

const PairingOptions: React.FC<PairingOptionsProps> = ({ pairings, onPairingsChange }) => {
  const [newPairing, setNewPairing] = useState<Pairing>({
    id: '',
    drinkName: '',
    foodItem: '',
    description: ''
  });

  const handleAddPairing = () => {
    if (!newPairing.drinkName || !newPairing.foodItem) return;
    
    const id = Date.now().toString();
    onPairingsChange([...pairings, { ...newPairing, id }]);
    setNewPairing({ id: '', drinkName: '', foodItem: '', description: '' });
  };

  const handleRemovePairing = (id: string) => {
    onPairingsChange(pairings.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Suggested Pairings</h3>
        <p className="text-sm text-muted-foreground">
          Recommend food pairings to enhance the mocktail experience
        </p>
      </div>
      
      {pairings.length > 0 && (
        <div className="space-y-3 mb-4">
          {pairings.map(pairing => (
            <div key={pairing.id} className="bg-muted/20 p-3 rounded-lg border flex justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Wine size={16} className="text-spiritless-pink mr-1" />
                  <span className="font-medium">{pairing.drinkName}</span>
                  <span className="mx-2 text-muted-foreground">+</span>
                  <UtensilsCrossed size={16} className="text-amber-500 mr-1" />
                  <span className="font-medium">{pairing.foodItem}</span>
                </div>
                {pairing.description && (
                  <p className="text-sm text-muted-foreground">{pairing.description}</p>
                )}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleRemovePairing(pairing.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <Card className="p-3">
        <div className="space-y-3">
          <div>
            <Label htmlFor="drinkName">Drink Name</Label>
            <Input
              id="drinkName"
              value={newPairing.drinkName}
              onChange={e => setNewPairing({...newPairing, drinkName: e.target.value})}
              placeholder="e.g., Sparkling Rosemary Lemonade"
            />
          </div>
          
          <div>
            <Label htmlFor="foodItem">Food Pairing</Label>
            <Input
              id="foodItem"
              value={newPairing.foodItem}
              onChange={e => setNewPairing({...newPairing, foodItem: e.target.value})}
              placeholder="e.g., Bruschetta with Goat Cheese"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Why It Works (optional)</Label>
            <Textarea
              id="description"
              value={newPairing.description}
              onChange={e => setNewPairing({...newPairing, description: e.target.value})}
              placeholder="Explain why this pairing works well together"
              rows={2}
            />
          </div>
          
          <Button 
            type="button"
            onClick={handleAddPairing}
            className="w-full"
            disabled={!newPairing.drinkName || !newPairing.foodItem}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Pairing
          </Button>
        </div>
      </Card>
      
      {pairings.length === 0 && (
        <p className="text-center py-3 text-sm text-muted-foreground italic">
          No pairings added yet
        </p>
      )}
    </div>
  );
};

export default PairingOptions;
