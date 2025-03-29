
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={className} 
      onClick={goBack}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
