
import React from 'react';

interface TabContentPlaceholderProps {
  title: string;
  description: string;
}

const TabContentPlaceholder: React.FC<TabContentPlaceholderProps> = ({ title, description }) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  );
};

export default TabContentPlaceholder;
