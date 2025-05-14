
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Log to confirm sidebar is rendering
  useEffect(() => {
    console.log('AdminSidebar rendering at path:', location.pathname);
  }, [location.pathname]);
  
  const toggleCategory = (categoryPath: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryPath) 
        ? prev.filter(path => path !== categoryPath) 
        : [...prev, categoryPath]
    );
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };
  
  return (
    <div className="bg-material-primary text-white w-64 flex-shrink-0 overflow-y-auto shadow-lg">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      
      <nav className="p-2">
        {adminNavItems.map(category => {
          const isExpanded = expandedCategories.includes(category.path);
          const hasActiveChild = category.children?.some(child => isActive(child.path));
          
          return (
            <div key={category.path} className="mb-1">
              {/* Category Header */}
              <button
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  (hasActiveChild || isExpanded) 
                    ? "bg-white/10" 
                    : "hover:bg-white/5"
                )}
                onClick={() => toggleCategory(category.path)}
              >
                {React.createElement(category.icon, { 
                  className: "h-4 w-4 mr-2 opacity-70" 
                })}
                <span>{category.label}</span>
                <div className="ml-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  )}
                </div>
              </button>
              
              {/* Category Children */}
              {isExpanded && category.children && (
                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                  {category.children.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isActive(item.path)
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {React.createElement(item.icon, { 
                        className: "h-4 w-4 mr-2" 
                      })}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
