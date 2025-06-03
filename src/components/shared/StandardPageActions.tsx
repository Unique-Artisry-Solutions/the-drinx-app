
// Standardized page actions component

import React from 'react';
import { Button } from '@/components/ui/button';
import { StandardAction } from './types';

interface StandardPageActionsProps {
  actions: StandardAction[];
}

const StandardPageActions: React.FC<StandardPageActionsProps> = ({ actions }) => {
  if (actions.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'default'}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className="flex items-center gap-2"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default StandardPageActions;
