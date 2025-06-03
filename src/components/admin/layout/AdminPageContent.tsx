
import React from 'react';

interface AdminPageContentProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const AdminPageContent: React.FC<AdminPageContentProps> = ({
  children,
  isLoading = false,
  className = '',
  padding = 'md'
}) => {
  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }[padding];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default AdminPageContent;
