
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash } from 'lucide-react';
import DrinkProfileModal, { Drink } from './DrinkProfileModal';
import { useToast } from '@/hooks/use-toast';

interface MocktailMenuTabProps {
  drinks: Drink[];
  onAddDrink: (drink: Drink) => void;
  onUpdateDrink: (drink: Drink) => void;
  onDeleteDrink: (id: string) => void;
}

const MocktailMenuTab: React.FC<MocktailMenuTabProps> = ({
  drinks,
  onAddDrink,
  onUpdateDrink,
  onDeleteDrink
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const { toast } = useToast();

  const handleOpenAddModal = () => {
    setSelectedDrink(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drink: Drink) => {
    setSelectedDrink(drink);
    setIsModalOpen(true);
  };

  const handleSaveDrink = (drink: Drink) => {
    if (selectedDrink) {
      onUpdateDrink(drink);
      toast({
        title: "Mocktail updated",
        description: `${drink.name} has been updated successfully.`,
      });
    } else {
      onAddDrink(drink);
      toast({
        title: "Mocktail added",
        description: `${drink.name} has been added to your menu.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mocktail Menu</CardTitle>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Mocktail
        </Button>
      </CardHeader>
      <CardContent>
        {drinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drinks.map(drink => (
              <div key={drink.id} className="border rounded-md overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={drink.photoUrl || 'https://placehold.co/300x200'} 
                    alt={drink.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="rounded-full h-8 w-8 bg-white/80"
                      onClick={() => handleOpenEditModal(drink)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => onDeleteDrink(drink.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{drink.name}</h3>
                      <span>{drink.price}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm mb-2 line-clamp-2">{drink.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {drink.ingredients.map((ingredient, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-material-secondary-container text-material-on-secondary-container px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">Your menu is empty</h3>
            <p className="text-material-on-surface-variant mb-4">
              Add your first mocktail to start building your menu
            </p>
            <Button onClick={handleOpenAddModal}>
              <Plus className="mr-2 h-4 w-4" /> Add Mocktail
            </Button>
          </div>
        )}
      </CardContent>

      <DrinkProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drink={selectedDrink}
        onSave={handleSaveDrink}
      />
    </Card>
  );
};

export default MocktailMenuTab;
