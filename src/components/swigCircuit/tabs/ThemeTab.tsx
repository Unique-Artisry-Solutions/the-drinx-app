
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ThemeSelection from '@/components/barCrawl/ThemeSelection';
import SimpleThemeCustomizer from '../theme/SimpleThemeCustomizer';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, CheckCircle2 } from 'lucide-react';

interface ThemeTabProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({
  selectedTheme,
  setSelectedTheme,
  onBack,
  onContinue
}) => {
  const [activeTab, setActiveTab] = useState<string>('presets');
  const { savedPalettes, loadCustomPalette } = useTheme();

  const handleThemeSaved = (themeName: string) => {
    // Switch to the saved themes tab automatically
    setActiveTab('saved');
  };

  const handleSelectCustomTheme = (themeName: string) => {
    loadCustomPalette(themeName);
    setSelectedTheme(themeName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
            <TabsTrigger value="saved">Saved Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <ThemeSelection 
              selectedTheme={selectedTheme} 
              onThemeSelect={setSelectedTheme} 
            />
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <SimpleThemeCustomizer onThemeSaved={handleThemeSaved} />
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(savedPalettes).length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <p>No saved themes yet. Create a theme in the Custom tab.</p>
                </div>
              ) : (
                Object.entries(savedPalettes).map(([name]) => (
                  <div 
                    key={name}
                    className={`border rounded-md p-4 cursor-pointer hover:border-primary transition-colors ${
                      selectedTheme === name ? 'border-2 border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelectCustomTheme(name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{name}</h3>
                      {selectedTheme === name && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: savedPalettes[name].primary }}
                        title="Primary color"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: savedPalettes[name].secondary }}
                        title="Secondary color"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: savedPalettes[name].accent }}
                        title="Accent color"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between space-x-2 pt-4 border-t">
          <div className="flex items-center">
            <Palette className="h-5 w-5 text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              {selectedTheme ? `Selected theme: ${selectedTheme}` : 'Please select a theme to continue'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="button"
              onClick={onContinue}
              disabled={!selectedTheme}
              className="bg-spiritless-pink hover:bg-spiritless-pink/90"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeTab;
