
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
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
  
  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };
  
  return (
    <div 
      className={cn(
        "bg-material-primary text-white h-full flex-shrink-0 overflow-y-auto shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ display: 'block', height: '100%' }}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        {!collapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <Button
          variant="ghost" 
          size="icon"
          onClick={toggleCollapse} 
          className="ml-auto text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className={cn("p-2", collapsed && "flex flex-col items-center")}>
        {adminNavItems.map(category => {
          const isExpanded = expandedCategories.includes(category.path);
          const hasActiveChild = category.children?.some(child => isActive(child.path));
          
          return (
            <div key={category.path} className={cn("mb-1", collapsed && "w-full flex justify-center")}>
              {/* Category Header */}
              <button
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  (hasActiveChild || isExpanded) 
                    ? "bg-white/10" 
                    : "hover:bg-white/5",
                  collapsed && "justify-center p-2"
                )}
                onClick={() => collapsed ? toggleCollapse() : toggleCategory(category.path)}
                title={collapsed ? category.label : undefined}
              >
                {React.createElement(category.icon, { 
                  className: cn("h-5 w-5", !collapsed && "mr-2 opacity-70") 
                })}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{category.label}</span>
                    <div className="ml-auto">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      )}
                    </div>
                  </>
                )}
              </button>
              
              {/* Category Children - Only show when not collapsed */}
              {!collapsed && isExpanded && category.children && (
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
                      title={collapsed ? item.label : undefined}
                    >
                      {React.createElement(item.icon, { 
                        className: "h-4 w-4 mr-2" 
                      })}
                      <span className="truncate">{item.label}</span>
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
