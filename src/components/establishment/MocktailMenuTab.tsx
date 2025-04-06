
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Camera } from 'lucide-react';
import DrinkProfileModal, { Drink } from './DrinkProfileModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  const [currentDrink, setCurrentDrink] = useState<Drink | null>(null);

  const handleAddClick = () => {
    setCurrentDrink(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (drink: Drink) => {
    setCurrentDrink(drink);
    setIsModalOpen(true);
  };

  const handleSaveDrink = (drink: Drink) => {
    if (currentDrink) {
      onUpdateDrink(drink);
    } else {
      onAddDrink(drink);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mocktail Menu</CardTitle>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" /> 
            Add Mocktail
          </Button>
        </CardHeader>
        <CardContent>
          {drinks.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No mocktails yet</h3>
              <p className="mt-2 text-muted-foreground">
                Add your first mocktail to your menu.
              </p>
              <Button onClick={handleAddClick} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> 
                Add Mocktail
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drinks.map((drink) => (
                <Card key={drink.id} className="overflow-hidden">
                  {drink.photoUrl ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={drink.photoUrl} 
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{drink.name}</h3>
                        <div className="text-left text-sm text-muted-foreground mt-1">
                          {drink.price}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditClick(drink)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove "{drink.name}" from your mocktail menu.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteDrink(drink.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    {drink.description && (
                      <p className="text-sm mt-2 text-left">{drink.description}</p>
                    )}
                    
                    {drink.ingredients && drink.ingredients.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1 text-left">Ingredients:</h4>
                        <ul className="text-sm text-left">
                          {drink.ingredients.map((ingredient, index) => (
                            <li key={index} className="inline-block mr-2 mb-1 bg-muted px-2 py-0.5 rounded-full text-xs">
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <DrinkProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        drink={currentDrink} 
        onSave={handleSaveDrink}
      />
    </>
  );
};

export default MocktailMenuTab;
