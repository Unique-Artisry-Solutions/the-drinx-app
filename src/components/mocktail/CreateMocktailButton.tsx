
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wine } from 'lucide-react';
import CreateMocktailModal from './CreateMocktailModal';
import { useTheme } from '@/contexts/ThemeContext';

const CreateMocktailButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  
  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-spiritless-pink hover:bg-spiritless-pink/90"
        size="sm"
      >
        <Wine className="mr-1 h-3.5 w-3.5" />
        <span className="text-xs font-normal">Create Recipe</span>
      </Button>

      <CreateMocktailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateMocktailButton;
