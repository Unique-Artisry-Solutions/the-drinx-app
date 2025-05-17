
import React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ className, text = 'Loading...' }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Spinner className="h-8 w-8 mb-4" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loading;
