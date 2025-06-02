
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ColorPicker from './ColorPicker';

interface ThemeCustomizerProps {
  onThemeChange?: (theme: any) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onThemeChange }) => {
  const currentTheme = {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b'
  };

  const handleColorChange = (colorType: string, color: string) => {
    const newTheme = { ...currentTheme, [colorType]: color };
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Customizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <ColorPicker
              color={currentTheme.primary}
              onChange={(color) => handleColorChange('primary', color)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <ColorPicker
              color={currentTheme.secondary}
              onChange={(color) => handleColorChange('secondary', color)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <ColorPicker
              color={currentTheme.accent}
              onChange={(color) => handleColorChange('accent', color)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full">Apply Theme</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;
