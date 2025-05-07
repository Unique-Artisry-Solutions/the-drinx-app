
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

interface UnifiedNavItemProps {
  path: string;
  icon?: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  dropdown?: {
    items: Array<{
      label: string;
      path: string;
    }>;
  };
  variant?: 'default' | 'mobile' | 'sidebar' | 'admin';
  userType?: 'individual' | 'establishment' | 'promoter';
}

/**
 * A unified navigation item component that works across all contexts
 * Supports regular links, buttons, and dropdown menus
 */
const UnifiedNavItem: React.FC<UnifiedNavItemProps> = ({ 
  path,
  icon: Icon,
  label,
  isActive = false,
  onClick,
  dropdown,
  variant = 'default',
  userType = 'individual'
}) => {
  // Determine active/inactive styles based on variant
  const getStyles = () => {
    // Default styles (desktop navigation)
    if (variant === 'default') {
      return {
        container: cn(
          "flex items-center px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        ),
        icon: "mr-2 h-4 w-4",
        label: "text-sm font-medium"
      };
    }
    
    // Mobile navigation
    if (variant === 'mobile') {
      const activeColor = userType === 'promoter' ? 'text-purple-600' : 'text-spiritless-pink';
      const inactiveColor = 'text-gray-500 hover:text-gray-700';
      
      return {
        container: cn(
          "flex flex-col items-center justify-center w-full h-full py-2 transition-all duration-300",
          isActive ? activeColor : inactiveColor
        ),
        icon: cn(
          "transition-transform duration-300 mb-1",
          isActive ? "scale-110" : "scale-100"
        ),
        label: cn(
          "text-xs font-medium transition-all duration-300",
          isActive ? "opacity-100" : "opacity-80"
        ),
        indicator: isActive && (
          "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 " +
          `after:w-1.5 after:h-1.5 after:${userType === 'promoter' ? 'bg-purple-600' : 'bg-spiritless-pink'} after:rounded-full after:animate-pulse`
        )
      };
    }
    
    // Sidebar navigation
    if (variant === 'sidebar') {
      return {
        container: cn(
          "flex items-center w-full px-2 py-2 rounded-md transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        ),
        icon: "mr-2 h-4 w-4",
        label: "text-sm"
      };
    }
    
    // Admin navigation
    if (variant === 'admin') {
      return {
        container: cn(
          "flex items-center w-full px-2 py-2 rounded-md transition-colors",
          isActive
            ? "bg-white/10 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        ),
        icon: "mr-2 h-4 w-4",
        label: "text-sm"
      };
    }
    
    // Default fallback
    return {
      container: "",
      icon: "h-4 w-4",
      label: "text-sm"
    };
  };
  
  const styles = getStyles();
  
  // Handle dropdown menu
  if (dropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={styles.container}
          >
            {Icon && <Icon className={styles.icon} />}
            <span className={styles.label}>{label}</span>
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

  // Handle onClick action (button)
  if (onClick) {
    return (
      <Button
        variant="ghost"
        onClick={onClick}
        className={styles.container}
      >
        {Icon && (
          <div className={cn("flex items-center justify-center relative", styles.indicator)}>
            <Icon className={styles.icon} />
          </div>
        )}
        <span className={styles.label}>{label}</span>
      </Button>
    );
  }

  // Regular link
  if (variant === 'mobile') {
    return (
      <LinkComponent
        href={path}
        className={styles.container}
      >
        {Icon && (
          <div className={cn("flex items-center justify-center mb-1 relative", styles.indicator)}>
            <Icon className={styles.icon} />
          </div>
        )}
        <span className={styles.label}>{label}</span>
      </LinkComponent>
    );
  }

  // Default link rendering
  return (
    <LinkComponent
      href={path}
      className={styles.container}
    >
      {Icon && <Icon className={styles.icon} />}
      <span className={styles.label}>{label}</span>
    </LinkComponent>
  );
};

export default UnifiedNavItem;
