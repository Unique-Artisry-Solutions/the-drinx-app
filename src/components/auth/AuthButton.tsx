
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  isLoading: boolean;
  type: 'submit' | 'button';
  onClick?: () => void;
  variant?: 'default' | 'outline';
  className?: string;
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading,
  type = 'submit',
  onClick,
  variant = 'default',
  className = 'w-full bg-spiritless-pink text-white hover:bg-spiritless-pink/90 font-bold shadow-md hover:shadow-lg transition-all',
  children
}) => {
  return (
    <Button
      type={type}
      className={className}
      variant={variant}
      disabled={isLoading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
