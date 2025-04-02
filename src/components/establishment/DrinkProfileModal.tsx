
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PhotoUploadField from '@/components/PhotoUploadField';
import IngredientInput from './IngredientInput';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    ingredients: [] as string[],
    photoUrl: ''
  });

  // Update form data when drink changes
  useEffect(() => {
    if (drink) {
      setFormData({
        name: drink.name || '',
        description: drink.description || '',
        price: drink.price || '',
        ingredients: drink.ingredients || [],
        photoUrl: drink.photoUrl || ''
      });
    } else {
      // Reset form for new drink
      setFormData({
        name: '',
        description: '',
        price: '',
        ingredients: [],
        photoUrl: ''
      });
    }
  }, [drink]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleIngredientsChange = (ingredients: string[]) => {
    setFormData(prev => ({
      ...prev,
      ingredients
    }));
  };
  
  const handlePhotoSelect = (file: File) => {
    // In a real app, this would upload the file to a server
    // For now, we'll just create a local URL
    const url = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      photoUrl: url
    }));
  };

  const handleSave = () => {
    const updatedDrink: Drink = {
      id: drink?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      ingredients: formData.ingredients,
      photoUrl: formData.photoUrl
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
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter mocktail name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter mocktail description"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              value={formData.price} 
              onChange={handleChange} 
              placeholder="$0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <IngredientInput 
              value={formData.ingredients}
              onChange={handleIngredientsChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Photo</Label>
            {formData.photoUrl ? (
              <div className="relative rounded-md overflow-hidden">
                <img 
                  src={formData.photoUrl} 
                  alt={formData.name} 
                  className="w-full h-48 object-cover"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
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
