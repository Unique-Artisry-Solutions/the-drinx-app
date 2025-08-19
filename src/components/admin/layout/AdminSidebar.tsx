import React, { useState, useEffect, startTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { adminNavItems } from '@/components/navigation/admin/AdminNavItems';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const toggleCollapse = () => {
    setCollapsed(prev => !prev);
  };
  
  const isActive = (path: string) => {
    // Exact match for home/dashboard paths
    if (path === '/admin' || path === '/admin/dashboard' || path === '/admin/system-breakdown') {
      return location.pathname === path;
    }
    // Prefix match for other paths
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    console.log('AdminSidebar: Navigation attempted to:', path);
    console.log('AdminSidebar: Current location:', location.pathname);
    
    if (path === '/admin/content-moderation') {
      console.log('AdminSidebar: Content Moderation navigation detected');
    }
    
    startTransition(() => {
      navigate(path);
    });
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
                onClick={() => handleNavigation(item.path)}
                title={collapsed ? item.label : undefined}
              >
                {React.createElement(item.icon, { 
                  className: cn("h-5 w-5", !collapsed && "mr-2 opacity-70") 
                })}
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;