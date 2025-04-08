
import React from 'react';
import { 
  Check, 
  AlertCircle, 
  X, 
  CircleDashed, 
  Clock,
  Database as DatabaseIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  FeatureStatus, 
  DatabaseStatus, 
  AccessLevel 
} from '../types';

export const renderStatusBadge = (status: FeatureStatus) => {
  switch (status) {
    case 'implemented':
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Implemented</Badge>
      );
    case 'partial':
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>
      );
    case 'planned':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Planned</Badge>;
    case 'not-started':
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>
      );
    default:
      return null;
  }
};

export const renderDatabaseStatusBadge = (status: string) => {
  switch (status) {
    case 'complete':
      return (
        <Badge variant="outline" className="border-green-500 text-green-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          Complete
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case 'not_started':
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          <DatabaseIcon className="mr-1 h-3 w-3" />
          Not Started
        </Badge>
      );
    default:
      return null;
  }
};

export const renderAccessIcon = (access: string) => {
  switch (access) {
    case 'full':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'partial':
      return <CircleDashed className="h-5 w-5 text-amber-500" />;
    case 'none':
      return <X className="h-5 w-5 text-gray-300" />;
    case 'planned':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
};
