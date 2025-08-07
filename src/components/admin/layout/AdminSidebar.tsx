
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  // Initialize expanded categories based on current path and defaults
  useEffect(() => {
    const savedExpanded = localStorage.getItem('admin_sidebar_expanded');
    let initialExpanded: string[] = [];
    
    if (savedExpanded) {
      try {
        initialExpanded = JSON.parse(savedExpanded);
      } catch (error) {
        console.error('Error parsing saved expanded state:', error);
      }
    }
    
    // Auto-expand items that have children and contain the current active page
    const activeCategories: string[] = [];
    adminNavItems.forEach(item => {
      if (item.children && item.children.length > 0) {
        const hasActiveChild = item.children.some(child => isActive(child.path));
        if (hasActiveChild) {
          activeCategories.push(item.path);
        }
      }
    });
    
    const combinedExpanded = Array.from(new Set([
      ...activeCategories,
      ...initialExpanded
    ]));
    
    setExpandedCategories(combinedExpanded);
  }, [location.pathname]);
  
  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('admin_sidebar_expanded', JSON.stringify(expandedCategories));
  }, [expandedCategories]);
  
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
  
  const hasActiveChild = (item: any) => {
    return item.children?.some((child: any) => isActive(child.path)) || false;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div 
      className={cn(
        "bg-material-primary text-white h-full flex-shrink-0 overflow-y-auto shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
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
      
      <nav className={cn("px-2 py-2", collapsed && "flex flex-col items-center")}>
        {adminNavItems.map(item => {
          const itemIsActive = isActive(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedCategories.includes(item.path);
          
          return (
            <div key={item.path} className={cn("mb-1", collapsed && "w-full flex justify-center")}>
              <button
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  itemIsActive 
                    ? "bg-white/25 text-white font-medium" 
                    : "hover:bg-white/10 text-white/90",
                  collapsed && "justify-center p-2"
                )}
                onClick={() => {
                  if (collapsed) {
                    toggleCollapse();
                  } else if (hasChildren) {
                    toggleCategory(item.path);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                title={collapsed ? item.label : undefined}
              >
                {React.createElement(item.icon, { 
                  className: cn("h-5 w-5", !collapsed && "mr-2 opacity-70") 
                })}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {hasChildren && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
              
              {!collapsed && isExpanded && hasChildren && (
                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                  {item.children.map(child => (
                    <button
                      key={child.path}
                      onClick={() => handleNavigation(child.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                        isActive(child.path)
                          ? "bg-white/25 text-white font-medium border-l-2 border-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      title={collapsed ? child.label : undefined}
                    >
                      {React.createElement(child.icon, { 
                        className: "h-4 w-4 mr-2" 
                      })}
                      <span className="truncate">{child.label}</span>
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

export default AdminSidebar;
