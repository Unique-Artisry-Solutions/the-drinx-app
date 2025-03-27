
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import TopNavigation from './TopNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-material-background">
      <TopNavigation />
      
      <main className="flex-1 pb-16 md:pb-6 pt-2 px-2 md:px-6 container max-w-5xl mx-auto">
        {children}
      </main>
      
      <nav className="fixed bottom-0 w-full bg-white elevation-3 z-50 md:hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-all-200",
                    isActive 
                      ? "text-material-primary" 
                      : "text-material-on-surface-variant"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center",
                    isActive && "animate-pulse-subtle"
                  )}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
