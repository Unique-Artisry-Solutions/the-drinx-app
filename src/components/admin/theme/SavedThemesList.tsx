
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';
import { Trash2, Check } from 'lucide-react';

const SavedThemesList: React.FC = () => {
  const { savedPalettes, loadCustomPalette, palette } = useTheme();
  const { toast } = useToast();
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);

  const handleDeleteTheme = (themeName: string) => {
    const updatedPalettes = { ...savedPalettes };
    delete updatedPalettes[themeName];
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    
    toast({
      title: 'Theme deleted',
      description: `The theme "${themeName}" has been deleted.`,
    });
    
    setThemeToDelete(null);
    
    // Force a refresh of the component
    window.location.reload();
  };

  const isCurrentTheme = (themePalette: ThemePalette): boolean => {
    return Object.entries(themePalette).every(
      ([key, value]) => (palette as any)[key] === value
    );
  };

  if (Object.keys(savedPalettes).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved themes yet. Create a theme in the Colors tab.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {Object.entries(savedPalettes).map(([name, themePalette]) => (
        <Card key={name} className="p-4 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {isCurrentTheme(themePalette) ? (
                <span className="flex items-center text-sm text-green-500">
                  <Check size={16} className="mr-1" /> Active
                </span>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    loadCustomPalette(name);
                    toast({
                      title: 'Theme applied',
                      description: `The theme "${name}" has been applied.`,
                    });
                  }}
                >
                  Apply
                </Button>
              )}
              
              <AlertDialog open={themeToDelete === name} onOpenChange={(open) => !open && setThemeToDelete(null)}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setThemeToDelete(name)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete theme</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the theme "{name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteTheme(name)} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 mt-3">
            {['primary', 'secondary', 'accent'].map((colorKey) => (
              <div key={colorKey} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: (themePalette as any)[colorKey] }}
                />
                <span className="text-xs capitalize">{colorKey}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedThemesList;
