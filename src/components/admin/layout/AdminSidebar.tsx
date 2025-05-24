
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    console.log('AdminSidebar: Rendering at path:', location.pathname);
    
    // Get expanded state from localStorage or set defaults
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
    adminNavItems.forEach(category => {
      if (category.children) {
        const hasActiveChild = category.children.some(child => isActive(child.path));
        if (hasActiveChild) {
          activeCategories.push(category.path);
          console.log('AdminSidebar: Auto-expanding category:', category.label, 'for path:', location.pathname);
        }
      }
    });
    
    // Default expanded categories for better UX
    const defaultExpanded = [
      '/admin/dashboard', // Dashboard & Analytics
      '/admin/content', // Content Management
      '/admin/system-tools', // System Tools
    ];
    
    // Combine all expanded categories (active + saved + defaults)
    const combinedExpanded = Array.from(new Set([
      ...activeCategories,
      ...initialExpanded,
      ...defaultExpanded
    ]));
    
    console.log('AdminSidebar: Setting expanded categories:', combinedExpanded);
    setExpandedCategories(combinedExpanded);
  }, [location.pathname]);
  
  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('admin_sidebar_expanded', JSON.stringify(expandedCategories));
  }, [expandedCategories]);
  
  const toggleCategory = (categoryPath: string) => {
    console.log('AdminSidebar: Toggling category:', categoryPath);
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
    const active = location.pathname === path || 
      (path !== '/admin/dashboard' && location.pathname.startsWith(path));
    if (active) {
      console.log('AdminSidebar: Active path detected:', path, 'for current:', location.pathname);
    }
    return active;
  };
  
  const hasActiveChild = (category: any) => {
    return category.children?.some((child: any) => isActive(child.path)) || false;
  };

  const handleNavigation = (path: string, label: string) => {
    console.log('AdminSidebar: Navigating to:', path, 'Label:', label);
    console.log('AdminSidebar: Current location before navigation:', location.pathname);
    navigate(path);
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
      
      <nav className={cn("px-2 py-2", collapsed && "flex flex-col items-center")}>
        {adminNavItems.map(category => {
          const isExpanded = expandedCategories.includes(category.path);
          const categoryHasActiveChild = hasActiveChild(category);
          
          return (
            <div key={category.path} className={cn("mb-1", collapsed && "w-full flex justify-center")}>
              {/* Category Header */}
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
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path, item.label)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
                        isActive(item.path)
                          ? "bg-white/25 text-white font-medium border-l-2 border-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      title={collapsed ? item.label : undefined}
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

export default AdminSidebar;
