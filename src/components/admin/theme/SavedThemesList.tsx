
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';
import { Trash2, Check, Download, Edit, Copy } from 'lucide-react';

const SavedThemesList: React.FC = () => {
  const { savedPalettes, loadCustomPalette, palette, saveCustomPalette } = useTheme();
  const { toast } = useToast();
  const [themeToDelete, setThemeToDelete] = useState<string | null>(null);
  const [themeToRename, setThemeToRename] = useState<string | null>(null);
  const [newThemeName, setNewThemeName] = useState<string>("");

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

  const handleDuplicateTheme = (themeName: string) => {
    const themeToClone = savedPalettes[themeName];
    const baseName = `${themeName} Copy`;
    let newName = baseName;
    let counter = 1;
    
    // Find an available name
    while (savedPalettes[newName]) {
      counter++;
      newName = `${baseName} ${counter}`;
    }
    
    saveCustomPalette(newName, themeToClone);
    toast({
      title: 'Theme Duplicated',
      description: `"${themeName}" has been duplicated as "${newName}".`,
    });
  };

  const handleRenameTheme = () => {
    if (!themeToRename || !newThemeName.trim()) return;
    
    // Don't rename if new name already exists
    if (savedPalettes[newThemeName] && newThemeName !== themeToRename) {
      toast({
        title: 'Name Already Exists',
        description: `A theme named "${newThemeName}" already exists.`,
        variant: 'destructive'
      });
      return;
    }
    
    const themeData = savedPalettes[themeToRename];
    const updatedPalettes = { ...savedPalettes };
    
    // Remove old name and add new one
    delete updatedPalettes[themeToRename];
    updatedPalettes[newThemeName] = themeData;
    
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    
    toast({
      title: 'Theme Renamed',
      description: `"${themeToRename}" has been renamed to "${newThemeName}".`,
    });
    
    setThemeToRename(null);
    setNewThemeName("");
    
    // Force a refresh of the component
    window.location.reload();
  };

  const handleExportTheme = (themeName: string) => {
    try {
      const themeData = JSON.stringify(savedPalettes[themeName], null, 2);
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `spiritless-theme-${themeName.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Theme Exported',
        description: `"${themeName}" has been exported successfully.`,
      });
    } catch (error) {
      console.error('Error exporting theme:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your theme.',
        variant: 'destructive',
      });
    }
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
            <div className="flex items-center gap-1">
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
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDuplicateTheme(name)}
                className="h-8 w-8"
              >
                <Copy size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setThemeToRename(name);
                  setNewThemeName(name);
                }}
                className="h-8 w-8"
              >
                <Edit size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleExportTheme(name)}
                className="h-8 w-8"
              >
                <Download size={14} />
              </Button>
              
              <AlertDialog open={themeToDelete === name} onOpenChange={(open) => !open && setThemeToDelete(null)}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setThemeToDelete(name)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                  >
                    <Trash2 size={14} />
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
          
          <div className="grid grid-cols-6 gap-1 mt-3">
            {['primary', 'secondary', 'accent', 'background', 'text', 'error'].map((colorKey) => (
              <div key={colorKey} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: (themePalette as any)[colorKey] }}
                />
                <span className="text-xs capitalize truncate">{colorKey}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Rename Dialog */}
      <AlertDialog 
        open={themeToRename !== null} 
        onOpenChange={(open) => !open && setThemeToRename(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Theme</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for "{themeToRename}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="New theme name"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenameTheme}>
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedThemesList;
