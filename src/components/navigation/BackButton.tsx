
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "link" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = "", 
  variant = "ghost", 
  size = "sm",
  label = "Back",
  fallbackPath = "/"
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    // If there's history to go back to, use it
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // If there's no history (e.g., opened in a new tab), go to fallback
      navigate(fallbackPath);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`mb-4 ${className}`} 
      onClick={goBack}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;
