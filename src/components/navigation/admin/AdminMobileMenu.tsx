
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { cn } from '@/lib/utils';

interface AdminMobileMenuProps {
  isOpen: boolean;
  username: string;
  navItems: UnifiedNavItem[];
  onItemClick: () => void;
  onLogout: () => void;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({
  isOpen,
  username,
  navItems,
  onItemClick,
  onLogout
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  if (!isOpen) return null;
  
  const toggleCategory = (path: string) => {
    setExpandedCategories(current => 
      current.includes(path)
        ? current.filter(item => item !== path)
        : [...current, path]
    );
  };
  
  const isCategoryExpanded = (path: string) => {
    return expandedCategories.includes(path);
  };
  
  return (
    <div className="admin-mobile-menu md:hidden fixed top-14 inset-x-0 z-50">
      <div className="bg-material-primary border-t border-white/10 text-white py-3 px-4 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="text-sm font-medium">{username}</div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((category) => (
            <div key={category.path} className="mobile-nav-category">
              {category.children ? (
                <div className="mb-2">
                  <div 
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => toggleCategory(category.path)}
                  >
                    <div className="flex items-center">
                      <category.icon className="mr-3 h-5 w-5" />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    {isCategoryExpanded(category.path) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  
                  {/* Sub-items */}
                  <div 
                    className={cn(
                      "pl-4 space-y-1 mt-1 overflow-hidden transition-all duration-300",
                      isCategoryExpanded(category.path) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {category.children.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                        onClick={onItemClick}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={category.path}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                  onClick={onItemClick}
                >
                  <category.icon className="mr-3 h-5 w-5" />
                  <span>{category.label}</span>
                </Link>
              )}
            </div>
          ))}
          
          <div className="pt-2 mt-2 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="w-full justify-start text-red-300 hover:bg-white/10 hover:text-red-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminMobileMenu;

