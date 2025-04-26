
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  dropdown?: {
    items: Array<{
      label: string;
      path: string;
    }>;
  };
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon: Icon, 
  label, 
  active = false,
  onClick,
  dropdown
}) => {
  const navigate = useNavigate();
  
  if (dropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-2 w-full justify-start px-3 py-2",
              active
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white z-50">
          {dropdown.items.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <Link
                to={item.path}
                className="flex items-center w-full px-2 py-1.5"
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
