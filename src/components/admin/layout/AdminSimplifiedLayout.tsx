
import React from 'react';

interface AdminSimplifiedLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const AdminSimplifiedLayout: React.FC<AdminSimplifiedLayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};
