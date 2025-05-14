
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { Button } from '@/components/ui/button';

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
  const location = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryPath: string) => {
    setExpandedCategory(prev => prev === categoryPath ? null : categoryPath);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Find the active category to auto-expand it
  React.useEffect(() => {
    const activeCategory = navItems.find(category => 
      category.children?.some(child => isActive(child.path))
    );
    if (activeCategory) {
      setExpandedCategory(activeCategory.path);
    }
  }, [location.pathname, navItems]);

  if (!isOpen) return null;

  return (
    <div className="admin-mobile-menu fixed inset-x-0 top-14 bg-material-primary border-t border-white/10 shadow-lg z-50 max-h-[calc(100vh-56px)] overflow-y-auto">
      <div className="p-4">
        <div className="mb-4 border-b border-white/10 pb-4">
          <p className="text-white text-sm">Signed in as</p>
          <p className="text-white font-semibold">{username}</p>
        </div>

        <div className="space-y-2">
          {navItems.map((category) => (
            <div key={category.path} className="border-b border-white/10 pb-2 last:border-0">
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-white/10 py-3"
                onClick={() => toggleCategory(category.path)}
              >
                <div className="flex items-center">
                  {React.createElement(category.icon, { className: "h-4 w-4 mr-3" })}
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
                {expandedCategory === category.path ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {expandedCategory === category.path && category.children && (
                <div className="pl-6 pt-1 pb-1 space-y-1">
                  {category.children.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm ${
                        isActive(item.path)
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={onItemClick}
                    >
                      {React.createElement(item.icon, { className: "h-4 w-4 mr-3" })}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Button
            variant="destructive"
            className="w-full mt-4"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminMobileMenu;
