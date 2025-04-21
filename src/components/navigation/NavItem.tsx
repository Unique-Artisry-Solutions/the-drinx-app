
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon: Icon, 
  label, 
  active = false,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};

export default NavItem;
