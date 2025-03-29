
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PhotoUploadField from '@/components/PhotoUploadField';

interface DrinkProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  drink: Drink | null;
  onSave: (drink: Drink) => void;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: string;
  ingredients: string[];
  photoUrl?: string;
}

const DrinkProfileModal: React.FC<DrinkProfileModalProps> = ({
  isOpen,
  onClose,
  drink,
  onSave
}) => {
  const [name, setName] = useState(drink?.name || '');
  const [description, setDescription] = useState(drink?.description || '');
  const [price, setPrice] = useState(drink?.price || '');
  const [ingredients, setIngredients] = useState(drink?.ingredients?.join(', ') || '');
  const [photoUrl, setPhotoUrl] = useState(drink?.photoUrl || '');
  
  const handlePhotoSelect = (file: File) => {
    // In a real app, this would upload the file to a server
    // For now, we'll just create a local URL
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleSave = () => {
    const updatedDrink: Drink = {
      id: drink?.id || Date.now().toString(),
      name,
      description,
      price,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      photoUrl
    };
    
    onSave(updatedDrink);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{drink ? 'Edit' : 'Add'} Mocktail</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter mocktail name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter mocktail description"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="$0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
            <Input 
              id="ingredients" 
              value={ingredients} 
              onChange={(e) => setIngredients(e.target.value)} 
              placeholder="ingredient1, ingredient2, ..."
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Photo</Label>
            {photoUrl ? (
              <div className="relative rounded-md overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt={name} 
                  className="w-full h-48 object-cover"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPhotoUrl('')}
                >
                  Change Photo
                </Button>
              </div>
            ) : (
              <PhotoUploadField onPhotoSelect={handlePhotoSelect} />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DrinkProfileModal;
