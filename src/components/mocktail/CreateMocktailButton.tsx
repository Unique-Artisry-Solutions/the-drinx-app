
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wine, Plus } from 'lucide-react';
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
        <Plus className="h-3.5 w-3.5" />
        <Wine className="h-3.5 w-3.5" />
      </Button>

      <CreateMocktailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateMocktailButton;
