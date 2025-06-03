
import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600 max-w-4xl">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
