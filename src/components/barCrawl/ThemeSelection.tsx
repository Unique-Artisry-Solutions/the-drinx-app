
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ThemeSelectionProps {
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
}

const ThemeSelection: React.FC<ThemeSelectionProps> = ({ selectedTheme, onThemeSelect }) => {
  const themeOptions: ThemeOption[] = [
    {
      id: 'tropical',
      name: 'Tropical Paradise',
      description: 'Fruity, refreshing drinks with a vacation vibe',
      icon: '🌴'
    },
    {
      id: 'herbal',
      name: 'Herbal Garden',
      description: 'Botanical-inspired drinks with fresh herbs and spices',
      icon: '🌿'
    },
    {
      id: 'classic',
      name: 'Timeless Classics',
      description: 'Non-alcoholic versions of traditional cocktail favorites',
      icon: '🥃'
    },
    {
      id: 'innovative',
      name: 'Experimental Concoctions',
      description: 'Cutting-edge mixology and unique flavor combinations',
      icon: '🧪'
    },
    {
      id: 'local',
      name: 'Local Flavors',
      description: 'Drinks featuring regional ingredients and specialties',
      icon: '🏙️'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Select a Theme</h3>
      <p className="text-sm text-muted-foreground mb-3">Define the vibe of your Swig Circuit</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {themeOptions.map((theme) => (
          <Button
            key={theme.id}
            variant={selectedTheme === theme.id ? "default" : "outline"}
            className={`h-auto py-3 px-4 justify-start text-left flex flex-col items-start relative ${
              selectedTheme === theme.id ? "border-spiritless-pink bg-spiritless-pink/10" : ""
            }`}
            onClick={() => onThemeSelect(theme.id)}
          >
            {selectedTheme === theme.id && (
              <Check size={16} className="absolute right-2 top-2 text-spiritless-pink" />
            )}
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2">{theme.icon}</span>
              <span className="font-medium">{theme.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{theme.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;
