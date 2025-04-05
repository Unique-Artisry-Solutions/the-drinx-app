
import { cn } from '@/lib/utils';

/**
 * Shared styles for profile dropdown components to maintain
 * consistency across light and dark themes
 */
export const profileDropdownStyles = {
  // Header styles
  header: (isDarkTheme: boolean) => cn(
    "px-3 py-2 text-sm font-medium mb-1",
    isDarkTheme 
      ? "text-gray-300 border-b border-gray-700" 
      : "text-gray-700 border-b border-gray-200"
  ),
  
  // Button styles
  dropdownButton: (isDarkTheme: boolean) => cn(
    "user-profile-button h-9 w-9 rounded-full transition-all duration-300 hover:text-spiritless-pink",
    isDarkTheme 
      ? "border-gray-700 bg-gray-800 hover:bg-gray-700" 
      : "border-gray-200 bg-white hover:bg-gray-50"
  ),
  
  // Dropdown content container
  dropdownContent: (isDarkTheme: boolean) => cn(
    "user-profile-dropdown w-56 backdrop-blur-sm shadow-md p-1 animate-fade-in",
    isDarkTheme 
      ? "bg-gray-800/90 border-gray-700" 
      : "bg-white/95 border border-gray-200"
  ),
  
  // Menu item styles
  menuItem: (isDarkTheme: boolean, isActive?: boolean) => cn(
    "user-profile-item flex items-center gap-2 cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
    isDarkTheme 
      ? "hover:bg-gray-700/50 text-gray-200" 
      : "hover:bg-gray-100 text-gray-700",
    isActive 
      ? isDarkTheme 
        ? "bg-gray-700/50 font-medium text-spiritless-pink" 
        : "bg-gray-100 font-medium text-spiritless-pink" 
      : ""
  ),
  
  // Menu item icon
  menuItemIcon: (isDarkTheme: boolean) => cn(
    isDarkTheme ? "h-4 w-4 text-gray-400" : "h-4 w-4 text-gray-700"
  ),
  
  // Tab options container
  tabOptionsContainer: (isDarkTheme: boolean) => cn(
    "px-1 py-1 mt-1",
    isDarkTheme ? "border-t border-gray-700" : "border-t border-gray-200"
  ),
  
  // Tab options label
  tabOptionsLabel: (isDarkTheme: boolean) => cn(
    "px-3 py-1 text-xs font-medium",
    isDarkTheme ? "text-gray-400" : "text-gray-700"
  ),
  
  // Separator
  separator: (isDarkTheme: boolean) => cn(
    "my-1",
    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
  )
};
