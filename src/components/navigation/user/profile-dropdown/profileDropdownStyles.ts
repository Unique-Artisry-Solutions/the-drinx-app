
export const profileDropdownStyles = {
  dropdownButton: (isDarkTheme: boolean) => 
    isDarkTheme 
      ? 'border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white bg-gray-800'
      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-white',
  
  header: (isDarkTheme: boolean) =>
    isDarkTheme
      ? 'border-b border-gray-700 bg-gray-800'
      : 'border-b border-gray-200',
  
  separator: (isDarkTheme: boolean) =>
    isDarkTheme
      ? 'bg-gray-700'
      : 'bg-gray-200',
  
  menuItem: (isDarkTheme: boolean, isActive?: boolean, customColor?: string) => {
    // Base classes
    const baseClasses = 'flex items-center px-2 py-1.5 rounded-md text-sm transition-colors';
    
    // Default active and hover states
    let stateClasses = '';
    
    if (customColor) {
      // Custom color states (for promoter)
      stateClasses = isActive 
        ? `bg-purple-50 ${customColor} font-medium` 
        : `hover:bg-purple-50 hover:${customColor}`;
    } else {
      // Standard states
      stateClasses = isActive
        ? isDarkTheme
          ? 'bg-gray-700 text-white font-medium'
          : 'bg-gray-100 text-gray-900 font-medium'
        : isDarkTheme
          ? 'hover:bg-gray-700 hover:text-white'
          : 'hover:bg-gray-100 hover:text-gray-900';
    }
    
    return `${baseClasses} ${stateClasses}`;
  }
};
