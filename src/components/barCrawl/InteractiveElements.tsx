
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface InteractiveElement {
  id: string;
  name: string;
  description: string;
}

interface InteractiveElementsProps {
  selectedElements: string[];
  onElementToggle: (elementId: string) => void;
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({ selectedElements, onElementToggle }) => {
  const interactiveOptions: InteractiveElement[] = [
    {
      id: 'mixology',
      name: 'Mixology Demonstrations',
      description: 'Include venues that offer mocktail-making demonstrations'
    },
    {
      id: 'tastings',
      name: 'Guided Tastings',
      description: 'Sample specially curated flights of spirit-free beverages'
    },
    {
      id: 'pairing',
      name: 'Food & Drink Pairings',
      description: 'Experience thoughtfully paired small plates with mocktails'
    },
    {
      id: 'interactive',
      name: 'DIY Stations',
      description: 'Create your own mocktails at interactive stations'
    },
    {
      id: 'education',
      name: 'Educational Sessions',
      description: 'Learn about ingredients and techniques from experts'
    }
  ];

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">Interactive Experiences</h3>
        <p className="text-sm text-muted-foreground">Select special activities to include in your Swig Circuit</p>
      </div>
      
      <div className="space-y-3">
        {interactiveOptions.map((option) => (
          <div key={option.id} className="flex items-start space-x-2 bg-muted/20 p-3 rounded-lg border">
            <Checkbox
              id={`interactive-${option.id}`}
              checked={selectedElements.includes(option.id)}
              onCheckedChange={() => onElementToggle(option.id)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <Label
                htmlFor={`interactive-${option.id}`}
                className="font-medium cursor-pointer"
              >
                {option.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveElements;
