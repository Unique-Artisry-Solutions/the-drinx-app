
// Define styles for profile dropdown components
export const profileDropdownStyles = {
  header: (isDarkTheme: boolean) => 
    `px-2 py-1.5 text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`,
  
  menuItem: (isDarkTheme: boolean, isActive?: boolean) => 
    `flex items-center gap-2 w-full text-sm px-2 py-1.5 rounded-sm ${
      isActive 
        ? `${isDarkTheme ? 'bg-gray-700 text-spiritless-pink' : 'bg-gray-100 text-spiritless-pink'}`
        : `${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
    } transition-colors`,
  
  menuItemIcon: (isDarkTheme: boolean) => 
    `h-4 w-4 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`,
  
  separator: (isDarkTheme: boolean) => 
    `${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`,
  
  tabItem: (isDarkTheme: boolean, isActive: boolean) => 
    `flex items-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors ${
      isActive 
        ? `${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-100 text-spiritless-pink font-medium'}`
        : `${isDarkTheme ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
    }`,
    
  // Add missing style functions
  dropdownButton: (isDarkTheme: boolean) => 
    `h-8 w-8 rounded-full p-0 border ${
      isDarkTheme 
        ? 'border-gray-600 bg-gray-800 text-white hover:border-gray-500 hover:bg-gray-700' 
        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
    }`,
    
  tabOptionsContainer: (isDarkTheme: boolean) => 
    `pt-1 pb-1 ${isDarkTheme ? 'border-t border-gray-700' : 'border-t border-gray-200'}`,
    
  tabOptionsLabel: (isDarkTheme: boolean) => 
    `text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} px-2 py-1`
};
