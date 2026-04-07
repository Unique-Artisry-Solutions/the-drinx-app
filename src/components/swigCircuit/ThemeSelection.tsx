
import React from 'react';
import { Check } from 'lucide-react';

interface ThemeSelectionProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

type Theme = {
  id: string;
  name: string;
  description: string;
  color: string;
};

const ThemeSelection: React.FC<ThemeSelectionProps> = ({
  selectedTheme,
  onThemeSelect,
}) => {
  const themes: Theme[] = [
    {
      id: 'tropical',
      name: 'Tropical Paradise',
      description: 'Bright, fruity flavors with exotic ingredients',
      color: 'bg-spiritless-orange',
    },
    {
      id: 'herbal',
      name: 'Herbal Garden',
      description: 'Fresh herb-infused mocktails with botanical flavors',
      color: 'bg-spiritless-green',
    },
    {
      id: 'classic',
      name: 'Classic Inspirations',
      description: 'Non-alcoholic versions of timeless cocktails',
      color: 'bg-spiritless-pink',
    },
    {
      id: 'seasonal',
      name: 'Seasonal Selections',
      description: 'Drinks that highlight seasonal ingredients',
      color: 'bg-spiritless-burgundy',
    },
    {
      id: 'creative',
      name: 'Creative Concoctions',
      description: 'Innovative and experimental flavor combinations',
      color: 'bg-spiritless-bright-orange',
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose a theme that sets the tone for your Swig Circuit experience.
      </p>
      <div className="grid grid-cols-1 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            className={`flex items-center p-4 rounded-lg border w-full ${
              selectedTheme === theme.id
                ? `border-2 ${theme.color} border-opacity-50 bg-opacity-10 ${theme.color}`
                : 'border-material-outline hover:bg-material-surface-variant/20'
            }`}
          >
            <div className={`w-3 h-12 rounded-full ${theme.color} mr-3`} />
            <div className="text-left flex-grow">
              <div className="font-medium">{theme.name}</div>
              <div className="text-sm text-muted-foreground truncate">
                {theme.description}
              </div>
            </div>
            {selectedTheme === theme.id && (
              <div className="ml-3">
                <Check className="h-5 w-5 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;
