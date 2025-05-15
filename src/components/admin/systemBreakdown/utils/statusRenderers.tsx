
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';
import { FeatureStatus, DatabaseStatus, FeatureItem } from '../types';

export const renderStatusIcon = (status: FeatureStatus): React.ReactNode => {
  switch (status) {
    case 'implemented':
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in_progress':
    case 'partial':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'blocked':
    case 'on-hold':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'planned':
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
    case 'testing':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
};

export const renderStatusBadge = (status: FeatureStatus | string): React.ReactNode => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'implemented':
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'in_progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'partial':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'blocked':
    case 'on-hold':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'planned':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    case 'testing':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <Badge className={`${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
};

export const renderDatabaseStatusBadge = (status?: DatabaseStatus | string): React.ReactNode => {
  if (!status) return null;

  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'complete':
    case 'implemented':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'in_progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'partial':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'blocked':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'not_started':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  // Safe string comparison using the right approach
  const label = status === 'complete' || status === 'implemented' ? 'Complete' : 
               status === 'in_progress' ? 'In Progress' : 
               status === 'partial' ? 'Partial' : 
               status === 'blocked' ? 'Blocked' : 'Not Started';

  return (
    <Badge className={`${bgColor} ${textColor} ml-2`}>
      DB: {label}
    </Badge>
  );
};
