
import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "link" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  fallbackPath?: string;
  showLabel?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = "", 
  variant = "ghost", 
  size = "sm",
  label = "Back",
  fallbackPath = "/",
  showLabel = true
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    // If there's history to go back to, use it
    if (window.history.length > 2) {
      startTransition(() => {
        navigate(-1);
      });
    } else {
      // If there's no history (e.g., opened in a new tab), go to fallback
      startTransition(() => {
        navigate(fallbackPath);
      });
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={goBack}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      {showLabel && <span className="ml-1">{label}</span>}
    </Button>
  );
};

export default BackButton;
