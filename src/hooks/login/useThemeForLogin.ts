
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const useThemeForLogin = () => {
  const { theme, setTheme } = useTheme();
  
  // Always force light theme for login page
  useEffect(() => {
    if (theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
};
