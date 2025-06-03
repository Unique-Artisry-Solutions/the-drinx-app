
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { useAdminLayout } from './AdminLayoutProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const OptimizedAdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    sidebarCollapsed, 
    sidebarExpandedCategories, 
    setSidebarCollapsed, 
    toggleSidebarCategory 
  } = useAdminLayout();
  
  // Auto-expand categories that contain the current active page
  useEffect(() => {
    adminNavItems.forEach(category => {
      if (category.children) {
        const hasActiveChild = category.children.some(child => isActive(child.path));
        if (hasActiveChild && !sidebarExpandedCategories.includes(category.path)) {
          toggleSidebarCategory(category.path);
        }
      }
    });
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };
  
  const hasActiveChild = (category: any) => {
    return category.children?.some((child: any) => isActive(child.path)) || false;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div 
      className={cn(
        "bg-material-primary text-white h-full flex-shrink-0 overflow-y-auto shadow-lg transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        {!sidebarCollapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <Button
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
          className="ml-auto text-white hover:bg-white/10"
        >
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className={cn("px-2 py-2", sidebarCollapsed && "flex flex-col items-center")}>
        {adminNavItems.map(category => {
          const isExpanded = sidebarExpandedCategories.includes(category.path);
          const categoryHasActiveChild = hasActiveChild(category);
          
          return (
            <div key={category.path} className={cn("mb-1", sidebarCollapsed && "w-full flex justify-center")}>
              <button
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  (categoryHasActiveChild || isExpanded) 
                    ? "bg-white/15 text-white" 
                    : "hover:bg-white/5 text-white/90",
                  sidebarCollapsed && "justify-center p-2"
                )}
                onClick={() => sidebarCollapsed ? setSidebarCollapsed(false) : toggleSidebarCategory(category.path)}
                title={sidebarCollapsed ? category.label : undefined}
              >
                {React.createElement(category.icon, { 
                  className: cn("h-5 w-5", !sidebarCollapsed && "mr-2 opacity-70") 
                })}
                {!sidebarCollapsed && (
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
              
              {!sidebarCollapsed && isExpanded && category.children && (
                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                  {category.children.map(item => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                        isActive(item.path)
                          ? "bg-white/25 text-white font-medium border-l-2 border-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {React.createElement(item.icon, { 
                        className: "h-4 w-4 mr-2" 
                      })}
                      <span className="truncate">{item.label}</span>
                    </button>
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

export default OptimizedAdminSidebar;
