
import React from 'react';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full py-2",
        isActive 
          ? "text-material-primary" 
          : "text-material-on-surface-variant"
      )}
    >
      <div className={cn(
        "flex items-center justify-center",
        isActive && "animate-pulse-subtle"
      )}>
        <Home size={24} />
      </div>
      <span className="text-xs mt-1">Home</span>
    </a>
  );
};

export default HomeButton;
