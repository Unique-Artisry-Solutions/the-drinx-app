
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cocktail } from 'lucide-react';
import CreateMocktailModal from './CreateMocktailModal';

const CreateMocktailButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-spiritless-pink hover:bg-spiritless-pink/90"
      >
        <Cocktail className="mr-2 h-4 w-4" />
        Create Mocktail Recipe
      </Button>

      <CreateMocktailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateMocktailButton;
