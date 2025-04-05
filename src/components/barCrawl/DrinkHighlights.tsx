
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';

export interface DrinkHighlight {
  id: string;
  name: string;
  description: string;
  establishment?: string;
}

interface DrinkHighlightsProps {
  highlights: DrinkHighlight[];
  onHighlightsChange: (highlights: DrinkHighlight[]) => void;
}

const DrinkHighlights: React.FC<DrinkHighlightsProps> = ({ highlights, onHighlightsChange }) => {
  const [newDrink, setNewDrink] = useState<DrinkHighlight>({
    id: '',
    name: '',
    description: '',
    establishment: ''
  });

  const handleAddDrink = () => {
    if (!newDrink.name || !newDrink.description) return;
    
    const newHighlight = {
      ...newDrink,
      id: Date.now().toString()
    };
    
    onHighlightsChange([...highlights, newHighlight]);
    setNewDrink({ id: '', name: '', description: '', establishment: '' });
  };

  const handleRemoveDrink = (id: string) => {
    onHighlightsChange(highlights.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Featured Drink Highlights</h3>
        <p className="text-sm text-muted-foreground">
          Showcase unique or signature beverages that participants should try
        </p>
      </div>
      
      {highlights.length > 0 && (
        <div className="space-y-3 mb-4">
          {highlights.map(drink => (
            <div key={drink.id} className="bg-muted/20 p-3 rounded-lg border flex justify-between">
              <div>
                <div className="font-medium">{drink.name}</div>
                <p className="text-sm text-muted-foreground">{drink.description}</p>
                {drink.establishment && (
                  <div className="text-xs text-muted-foreground mt-1">
                    At: {drink.establishment}
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleRemoveDrink(drink.id)}
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
              value={newDrink.name}
              onChange={e => setNewDrink({...newDrink, name: e.target.value})}
              placeholder="e.g., Cucumber Mint Refresher"
            />
          </div>
          
          <div>
            <Label htmlFor="establishment">At Establishment (optional)</Label>
            <Input
              id="establishment"
              value={newDrink.establishment}
              onChange={e => setNewDrink({...newDrink, establishment: e.target.value})}
              placeholder="e.g., Garden Lounge"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newDrink.description}
              onChange={e => setNewDrink({...newDrink, description: e.target.value})}
              placeholder="Describe what makes this drink special"
              rows={2}
            />
          </div>
          
          <Button 
            type="button"
            onClick={handleAddDrink}
            className="w-full"
            disabled={!newDrink.name || !newDrink.description}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Drink Highlight
          </Button>
        </div>
      </Card>
      
      {highlights.length === 0 && (
        <p className="text-center py-3 text-sm text-muted-foreground italic">
          No drink highlights added yet
        </p>
      )}
    </div>
  );
};

export default DrinkHighlights;
