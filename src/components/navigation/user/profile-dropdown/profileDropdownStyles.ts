
import { cva } from 'class-variance-authority';

export const profileDropdownStyles = {
  menuItem: (isDarkTheme: boolean, isActive: boolean = false, customColor?: string) => {
    let baseClasses = 'flex items-center px-3 py-2 text-sm rounded-md transition-colors';
    
    // Handle dark theme base colors
    if (isDarkTheme) {
      baseClasses += ' hover:bg-gray-800';
      if (isActive) {
        baseClasses += ' bg-gray-800 font-medium';
      } else {
        baseClasses += ' text-gray-300';
      }
    } else {
      baseClasses += ' hover:bg-gray-100';
      if (isActive) {
        baseClasses += ' bg-gray-100 font-medium';
      } else {
        baseClasses += ' text-gray-700';
      }
    }
    
    // Handle custom colors (for promoters)
    if (customColor) {
      if (isActive) {
        baseClasses += ` ${customColor} bg-purple-50`;
      } else {
        baseClasses += ' hover:bg-purple-50';
      }
    }
    
    return baseClasses;
  },
  
  separator: (isDarkTheme: boolean) => {
    return isDarkTheme ? 'bg-gray-700' : 'bg-gray-200';
  },
  
  dropdownButton: (isDarkTheme: boolean) => {
    return isDarkTheme 
      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
      : 'bg-background border-border hover:bg-accent';
  }
};
