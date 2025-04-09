
import React from 'react';
import { ComponentGroup, ComponentCatalogItem } from './types';
import ComponentCard from './ComponentCard';

interface ComponentGroupSectionProps {
  group: ComponentGroup;
  onSelectComponent: (component: ComponentCatalogItem) => void;
}

const ComponentGroupSection: React.FC<ComponentGroupSectionProps> = ({ group, onSelectComponent }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
      <p className="text-gray-500 mb-4">{group.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {group.components.map((component) => (
          <ComponentCard 
            key={component.id} 
            component={component} 
            onSelectComponent={onSelectComponent} 
          />
        ))}
      </div>
    </div>
  );
};

export default ComponentGroupSection;
