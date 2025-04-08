
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';
import ColorPicker from './ColorPicker';
import SavedThemesList from './SavedThemesList';

const ThemeCustomizer: React.FC = () => {
  const { theme, palette, setPalette, resetPalette, saveCustomPalette, savedPalettes } = useTheme();
  const [themeName, setThemeName] = useState<string>('');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('colors');
  const isLightTheme = theme === 'light';

  const handleSaveTheme = () => {
    if (!themeName.trim()) {
      toast({
        title: 'Theme name required',
        description: 'Please enter a name for your custom theme',
        variant: 'destructive',
      });
      return;
    }

    if (savedPalettes[themeName]) {
      toast({
        title: 'Theme already exists',
        description: 'A theme with this name already exists. Please choose another name or overwrite the existing theme.',
        variant: 'destructive',
      });
      return;
    }

    saveCustomPalette(themeName, palette);
    toast({
      title: 'Theme saved',
      description: `Your custom theme "${themeName}" has been saved successfully.`,
    });
    setThemeName('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Customization</CardTitle>
        <CardDescription>
          Customize the appearance of your application by adjusting colors and visual elements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="saved">Saved Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
                <div className="space-y-4">
                  <ColorPicker 
                    label="Primary" 
                    value={palette.primary} 
                    onChange={(color) => setPalette({ primary: color })} 
                  />
                  <ColorPicker 
                    label="Secondary" 
                    value={palette.secondary} 
                    onChange={(color) => setPalette({ secondary: color })} 
                  />
                  <ColorPicker 
                    label="Accent" 
                    value={palette.accent} 
                    onChange={(color) => setPalette({ accent: color })} 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">UI Colors</h3>
                <div className="space-y-4">
                  <ColorPicker 
                    label="Background" 
                    value={palette.background} 
                    onChange={(color) => setPalette({ background: color })} 
                  />
                  <ColorPicker 
                    label="Card Background" 
                    value={palette.cardBackground} 
                    onChange={(color) => setPalette({ cardBackground: color })} 
                  />
                  <ColorPicker 
                    label="Border" 
                    value={palette.border} 
                    onChange={(color) => setPalette({ border: color })} 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Text Colors</h3>
                <div className="space-y-4">
                  <ColorPicker 
                    label="Text" 
                    value={palette.text} 
                    onChange={(color) => setPalette({ text: color })} 
                  />
                  <ColorPicker 
                    label="Muted Text" 
                    value={palette.mutedText} 
                    onChange={(color) => setPalette({ mutedText: color })} 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Status Colors</h3>
                <div className="space-y-4">
                  <ColorPicker 
                    label="Success" 
                    value={palette.success} 
                    onChange={(color) => setPalette({ success: color })} 
                  />
                  <ColorPicker 
                    label="Warning" 
                    value={palette.warning} 
                    onChange={(color) => setPalette({ warning: color })} 
                  />
                  <ColorPicker 
                    label="Error" 
                    value={palette.error} 
                    onChange={(color) => setPalette({ error: color })} 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="themeName">Theme Name</Label>
                <Input 
                  id="themeName" 
                  placeholder="Enter a name for this theme" 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)} 
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveTheme} variant="default">
                  Save Theme
                </Button>
                <Button onClick={resetPalette} variant="outline">
                  Reset to Default
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedThemesList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;
