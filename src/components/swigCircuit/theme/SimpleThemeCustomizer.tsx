
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';

interface SimpleThemeCustomizerProps {
  onThemeSaved: (themeName: string) => void;
}

const SimpleThemeCustomizer: React.FC<SimpleThemeCustomizerProps> = ({ onThemeSaved }) => {
  const { palette, setPalette, resetPalette, saveCustomPalette } = useTheme();
  const [themeName, setThemeName] = useState<string>('');
  const { toast } = useToast();
  
  const handleSaveTheme = () => {
    if (!themeName.trim()) {
      toast({
        title: 'Theme name required',
        description: 'Please enter a name for your custom theme',
        variant: 'destructive',
      });
      return;
    }
    
    saveCustomPalette(themeName, palette);
    toast({
      title: 'Theme saved',
      description: `Your custom theme "${themeName}" has been saved successfully.`,
    });
    
    onThemeSaved(themeName);
    setThemeName('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Create Custom Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: palette.primary }}
            />
            <Input 
              id="primary-color"
              type="color"
              value={palette.primary}
              onChange={(e) => setPalette({ primary: e.target.value })}
              className="w-20 h-10 p-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: palette.secondary }}
            />
            <Input 
              id="secondary-color"
              type="color"
              value={palette.secondary}
              onChange={(e) => setPalette({ secondary: e.target.value })}
              className="w-20 h-10 p-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: palette.accent }}
            />
            <Input 
              id="accent-color"
              type="color"
              value={palette.accent}
              onChange={(e) => setPalette({ accent: e.target.value })}
              className="w-20 h-10 p-1"
            />
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Label htmlFor="theme-name">Theme Name</Label>
          <Input 
            id="theme-name"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="My Custom Theme"
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={resetPalette} variant="outline" className="flex items-center gap-1">
          <RefreshCw size={16} />
          Reset Colors
        </Button>
        <Button onClick={handleSaveTheme} variant="default" className="flex items-center gap-1">
          <Save size={16} />
          Save Theme
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SimpleThemeCustomizer;
