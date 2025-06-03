
import React from 'react';
import { Button } from '@/components/ui/button';
import { AdminPageAction } from './AdminPageLayout';
import { Loader2 } from 'lucide-react';

interface AdminPageActionsProps {
  actions: AdminPageAction[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const AdminPageActions: React.FC<AdminPageActionsProps> = ({
  actions,
  orientation = 'horizontal',
  className = ''
}) => {
  const containerClass = orientation === 'horizontal' 
    ? 'flex flex-wrap gap-3' 
    : 'flex flex-col gap-2';

  return (
    <div className={`${containerClass} ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'default'}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className="flex items-center gap-2"
        >
          {action.loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            action.icon && <action.icon className="h-4 w-4" />
          )}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default AdminPageActions;
