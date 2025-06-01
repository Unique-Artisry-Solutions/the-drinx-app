
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Define extended nav item type with children
interface ExtendedNavItem {
  path: string;
  label: string;
  icon: any;
  showInNav?: boolean;
  children?: ExtendedNavItem[];
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  // Type assertion for nav items with children
  const navItems = adminNavItems as ExtendedNavItem[];
  
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
    
    // Auto-expand categories that contain the current active page
    const activeCategories: string[] = [];
    navItems.forEach(category => {
      if (category.children) {
        const hasActiveChild = category.children.some((child: ExtendedNavItem) => isActive(child.path));
        if (hasActiveChild) {
          activeCategories.push(category.path);
        }
      }
    });
    
    // Default expanded categories for better UX
    const defaultExpanded = [
      '/admin/dashboard',
      '/admin/content',
      '/admin/system-tools',
    ];
    
    const combinedExpanded = Array.from(new Set([
      ...activeCategories,
      ...initialExpanded,
      ...defaultExpanded
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
  
  const hasActiveChild = (category: ExtendedNavItem) => {
    return category.children?.some((child: ExtendedNavItem) => isActive(child.path)) || false;
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
        {navItems.map(category => {
          const isExpanded = expandedCategories.includes(category.path);
          const categoryHasActiveChild = hasActiveChild(category);
          const IconComponent = category.icon;
          
          return (
            <div key={category.path} className={cn("mb-1", collapsed && "w-full flex justify-center")}>
              <button
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  (categoryHasActiveChild || isExpanded) 
                    ? "bg-white/15 text-white" 
                    : "hover:bg-white/5 text-white/90",
                  collapsed && "justify-center p-2"
                )}
                onClick={() => collapsed ? toggleCollapse() : toggleCategory(category.path)}
                title={collapsed ? category.label : undefined}
              >
                {IconComponent && (
                  <IconComponent className={cn("h-5 w-5", !collapsed && "mr-2 opacity-70")} />
                )}
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
              
              {!collapsed && isExpanded && category.children && (
                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
                  {category.children.map((item: ExtendedNavItem) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                          isActive(item.path)
                            ? "bg-white/25 text-white font-medium border-l-2 border-white"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {ItemIcon && (
                          <ItemIcon className="h-4 w-4 mr-2" />
                        )}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
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
