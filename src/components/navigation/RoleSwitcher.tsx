
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { useRoleSwitch } from '@/hooks/useRoleSwitch';
import { cn } from '@/lib/utils';

export function RoleSwitcher() {
  const { availableRoles, currentRole, isLoading, switchRole } = useRoleSwitch();

  // Don't show the switcher if user has no multiple roles
  if (availableRoles.length <= 1) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'establishment':
        return 'Business Account';
      case 'promoter':
        return 'Promoter Account';
      default:
        return 'Personal Account';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'establishment':
        return 'text-spiritless-green';
      case 'promoter':
        return 'text-purple-600';
      default:
        return 'text-spiritless-pink';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2",
            getRoleColor(currentRole)
          )}
        >
          <UserCog className="h-4 w-4" />
          <span className="hidden md:inline">Switch Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => role !== currentRole && switchRole(role)}
            className={cn(
              "cursor-pointer",
              role === currentRole && "bg-accent",
              getRoleColor(role)
            )}
          >
            {getRoleLabel(role)}
            {role === currentRole && " (Current)"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
