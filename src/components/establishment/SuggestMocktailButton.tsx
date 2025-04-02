
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import SuggestMocktailModal from '@/components/user/SuggestMocktailModal';

interface SuggestMocktailButtonProps {
  establishmentId: string;
  establishmentName: string;
}

const SuggestMocktailButton: React.FC<SuggestMocktailButtonProps> = ({
  establishmentId,
  establishmentName
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="text-spiritless-green border-spiritless-green hover:bg-spiritless-green/10"
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Suggest a Mocktail
      </Button>

      <SuggestMocktailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        establishmentId={establishmentId}
        establishmentName={establishmentName}
      />
    </>
  );
};

export default SuggestMocktailButton;
