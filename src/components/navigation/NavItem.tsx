
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import LinkComponent from './LinkComponent';
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

/**
 * A standardized navigation item component
 * Supports both regular links and dropdown menus
 */
const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon: Icon, 
  label, 
  active = false,
  onClick,
  dropdown
}) => {
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
              <LinkComponent
                href={item.path}
                className="flex items-center w-full px-2 py-1.5"
              >
                <span className="text-sm">{item.label}</span>
              </LinkComponent>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (onClick) {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2 rounded-md transition-colors w-auto justify-start",
          active
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </Button>
    );
  }

  return (
    <LinkComponent
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </LinkComponent>
  );
};

export default NavItem;
