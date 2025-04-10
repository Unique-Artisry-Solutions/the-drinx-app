
import React from 'react';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  isPromoter?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ 
  isActive, 
  onClick,
  isPromoter = false
}) => {
  const activeColor = isPromoter ? 'text-purple-600' : 'text-spiritless-pink';
  const inactiveColor = 'text-gray-500 hover:text-gray-700';

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full py-2 transition-all duration-300",
        isActive ? activeColor : inactiveColor
      )}
      aria-label="Home"
    >
      <div className={cn(
        "flex items-center justify-center mb-1 relative",
        isActive && (
          "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 " +
          `after:w-1.5 after:h-1.5 after:${isPromoter ? 'bg-purple-600' : 'bg-spiritless-pink'} after:rounded-full after:animate-pulse`
        )
      )}>
        <Home size={22} className={cn(
          "transition-transform duration-300",
          isActive ? "scale-110" : "scale-100"
        )} />
      </div>
      <span className={cn(
        "text-xs font-medium transition-all duration-300",
        isActive ? "opacity-100" : "opacity-80"
      )}>
        Home
      </span>
    </button>
  );
};

export default HomeButton;
