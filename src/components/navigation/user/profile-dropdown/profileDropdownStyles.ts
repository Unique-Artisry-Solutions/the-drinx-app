
export const profileDropdownStyles = {
  dropdownButton: (isDarkTheme: boolean) => 
    `relative p-0 h-8 w-8 border-0 ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center`,
  
  dropdownContent: (isDarkTheme: boolean) => 
    `min-w-[200px] p-2 ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg rounded-md z-50`,
  
  header: (isDarkTheme: boolean) => 
    `px-3 py-2 text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} font-medium border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} mb-1`,
  
  menuItem: (isDarkTheme: boolean, isActive?: boolean) => 
    `flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md ${isActive ? 'bg-pink-50 text-spiritless-pink' : ''} ${isDarkTheme ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'} transition-colors`,
  
  menuItemIcon: (isDarkTheme: boolean) => 
    `h-4 w-4 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`,
  
  separator: (isDarkTheme: boolean) => 
    `my-1 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`,
  
  tabOptionsContainer: (isDarkTheme: boolean) => 
    `pt-1 ${isDarkTheme ? 'border-t border-gray-700' : 'border-t border-gray-200'}`,
  
  tabOptionsLabel: (isDarkTheme: boolean) => 
    `px-3 text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`
};
