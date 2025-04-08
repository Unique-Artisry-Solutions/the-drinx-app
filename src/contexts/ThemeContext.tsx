
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'dark' | 'light';

// Define our color palette structure for theme customization
export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  text: string;
  mutedText: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

// Default theme palettes
const defaultLightPalette: ThemePalette = {
  primary: '#D94E8F', // Pink
  secondary: '#84BF04', // Green
  accent: '#F29F05', // Orange
  background: '#f5f3ed', // Eggshell
  cardBackground: '#ffffff',
  text: '#111827',
  mutedText: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#590202' // Burgundy
};

const defaultDarkPalette: ThemePalette = {
  primary: '#D94E8F', // Pink
  secondary: '#84BF04', // Green
  accent: '#F29F05', // Orange
  background: '#121212',
  cardBackground: '#1e1e1e',
  text: '#f9fafb',
  mutedText: '#9ca3af',
  border: '#374151',
  success: '#059669',
  warning: '#d97706',
  error: '#9c2a2a'
};

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  palette: ThemePalette;
  setPalette: (palette: Partial<ThemePalette>) => void;
  resetPalette: () => void;
  isCustomPalette: boolean;
  saveCustomPalette: (name: string, palette: ThemePalette) => void;
  loadCustomPalette: (name: string) => void;
  savedPalettes: Record<string, ThemePalette>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial theme from localStorage or default to dark
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'dark';
  });

  // State for the current color palette
  const [palette, setPaletteState] = useState<ThemePalette>(theme === 'dark' ? defaultDarkPalette : defaultLightPalette);
  const [isCustomPalette, setIsCustomPalette] = useState<boolean>(false);
  const [savedPalettes, setSavedPalettes] = useState<Record<string, ThemePalette>>(() => {
    const savedPalettesStr = localStorage.getItem('savedPalettes');
    return savedPalettesStr ? JSON.parse(savedPalettesStr) : {};
  });

  // Update the palette when theme changes
  useEffect(() => {
    if (!isCustomPalette) {
      setPaletteState(theme === 'dark' ? defaultDarkPalette : defaultLightPalette);
    }
  }, [theme, isCustomPalette]);

  // Update theme in localStorage and apply changes to document
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply the theme to the document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? palette.background : palette.background
      );
    }

    // Apply CSS variables for the current palette
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', palette.primary);
    root.style.setProperty('--theme-secondary', palette.secondary);
    root.style.setProperty('--theme-accent', palette.accent);
    root.style.setProperty('--theme-background', palette.background);
    root.style.setProperty('--theme-card-background', palette.cardBackground);
    root.style.setProperty('--theme-text', palette.text);
    root.style.setProperty('--theme-muted-text', palette.mutedText);
    root.style.setProperty('--theme-border', palette.border);
    root.style.setProperty('--theme-success', palette.success);
    root.style.setProperty('--theme-warning', palette.warning);
    root.style.setProperty('--theme-error', palette.error);
    
    // Apply the core spiritless colors as CSS variables too
    root.style.setProperty('--spiritless-pink', palette.primary);
    root.style.setProperty('--spiritless-green', palette.secondary);
    root.style.setProperty('--spiritless-orange', palette.accent);
    root.style.setProperty('--spiritless-burgundy', palette.error);
    
    // Update core Tailwind CSS variables as well
    root.style.setProperty('--pink', palette.primary);
    root.style.setProperty('--orange', palette.accent);
    root.style.setProperty('--green', palette.secondary);
  }, [theme, palette]);

  // Save palettes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setPalette = (newPalette: Partial<ThemePalette>) => {
    setPaletteState(prev => ({
      ...prev,
      ...newPalette
    }));
    setIsCustomPalette(true);
  };

  const resetPalette = () => {
    setPaletteState(theme === 'dark' ? defaultDarkPalette : defaultLightPalette);
    setIsCustomPalette(false);
  };

  const saveCustomPalette = (name: string, customPalette: ThemePalette) => {
    setSavedPalettes(prev => ({
      ...prev,
      [name]: customPalette
    }));
  };

  const loadCustomPalette = (name: string) => {
    if (savedPalettes[name]) {
      setPaletteState(savedPalettes[name]);
      setIsCustomPalette(true);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      palette, 
      setPalette,
      resetPalette,
      isCustomPalette,
      saveCustomPalette,
      loadCustomPalette,
      savedPalettes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
